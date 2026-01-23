import { prisma } from "@/lib/prisma";
import { JobBackendSchema } from "@/lib/validations/backend/jobBackend.schema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

type PrismaTx = Parameters<typeof prisma.$transaction>[0] extends (
  prisma: infer T
) => any
  ? T
  : never;

type JobListItem = {
  id: string;
  jobTitle: string;
  city: string;
  state: string;
  locationType: string;
  minExperience: string;
  minEducation: string;
  jobType: string;
  minSalary: string;
  maxSalary: string;
  status: string;
  totalCredits: number;
  creditsUsed: number;
  applications: { id: string }[];
};

/* ======================================================
   CREATE JOB
====================================================== */
export async function POST(req: Request) {
  try {
    /* --------------------------------
       1. Auth
    --------------------------------- */
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    /* --------------------------------
       2. Employer
    --------------------------------- */
    const employer = await prisma.employer.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!employer) {
      return NextResponse.json(
        { success: false, message: "Employer not found" },
        { status: 404 }
      );
    }

    /* --------------------------------
       3. Get latest SUCCESS + unconsumed payment
       CHANGE: ensure only valid payments can post jobs
    --------------------------------- */
    const payment = await prisma.payment.findFirst({
      where: {
        employerId: employer.id,
        status: "SUCCESS", // ✅ IMPORTANT
        isConsumed: false,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        planId: true,
      },
    });

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          message: "No active plan available to post a job",
        },
        { status: 403 }
      );
    }

    /* --------------------------------
       4. Fetch plan to snapshot credits
       CHANGE: credits now belong to JOB
    --------------------------------- */
    const plan = await prisma.plan.findUnique({
      where: { id: payment.planId },
      select: { creditsPerJob: true },
    });

    if (!plan) {
      return NextResponse.json(
        { success: false, message: "Plan not found" },
        { status: 400 }
      );
    }

    /* --------------------------------
       5. Validate payload
    --------------------------------- */
    const body = await req.json();
    const validatedData = JobBackendSchema.parse(body);

    /* --------------------------------
       6. Atomic transaction
       CHANGE: snapshot totalCredits from plan
    --------------------------------- */
    const job = await prisma.$transaction(async (tx: PrismaTx) => {
      const createdJob = await tx.job.create({
        data: {
          ...validatedData,
          employerId: employer.id,
          planId: payment.planId,
          paymentId: payment.id,

          totalCredits: plan.creditsPerJob, // ✅ SNAPSHOT
          creditsUsed: 0,

          expiresAt: new Date(
            Date.now() + 15 * 24 * 60 * 60 * 1000
          ),

          filteringQuestions: validatedData.filteringQuestions
            ? { create: validatedData.filteringQuestions }
            : undefined,
        },
      });

      // Mark payment as consumed so it cannot be reused
      await tx.payment.update({
        where: { id: payment.id },
        data: { isConsumed: true },
      });

      return createdJob;
    });

    return NextResponse.json(
      { success: true, job },
      { status: 201 }
    );
  } catch (error) {
    console.error("[JOB_CREATE_ERROR]", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input data",
          issues: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create job" },
      { status: 500 }
    );
  }
}

/* ======================================================
   GET JOBS
====================================================== */
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ jobs: [] }, { status: 401 });
  }

  const employer = await prisma.employer.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!employer) {
    return NextResponse.json({ jobs: [] });
  }

  const jobs = await prisma.job.findMany({
    where: { employerId: employer.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      jobTitle: true,
      city: true,
      state: true,
      locationType: true,
      minExperience: true,
      minEducation: true,
      jobType: true,
      minSalary: true,
      maxSalary: true,
      status: true,

      totalCredits: true,  // ✅ JOB owns credits
      creditsUsed: true,   // ✅ JOB usage

      applications: { select: { id: true } },
    },
  });

  return NextResponse.json({
    jobs: jobs.map((job: JobListItem) => ({
      ...job,
      applicationsCount: job.applications.length,
      availableCredits: job.totalCredits - job.creditsUsed,
    })),
  });
}
