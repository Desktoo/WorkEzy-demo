import { getActiveUnconsumedPayment } from "@/lib/payments/GetActivePayment";
import { prisma } from "@/lib/prisma";
import { JobBackendSchema } from "@/lib/validations/backend/jobBackend.schema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    /* --------------------------------
       1. Auth check
    --------------------------------- */
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    /* --------------------------------
       2. Resolve employer
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
       3. Get active payment
    --------------------------------- */
    const payment = await getActiveUnconsumedPayment(employer.id);

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
       4. Validate payload
    --------------------------------- */
    const body = await req.json();
    const validatedData = JobBackendSchema.parse(body);

    /* --------------------------------
       5. Transaction (atomic)
    --------------------------------- */
    const result = await prisma.$transaction(async (tx) => {
      const job = await tx.job.create({
        data: {
          ...validatedData,
          employerId: employer.id,
          planId: payment.planId,
          expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),

          filteringQuestions: validatedData.filteringQuestions
            ? {
                create: validatedData.filteringQuestions,
              }
            : undefined,
        },
      });

      await tx.payment.update({
        where: { id: payment.id },
        data: { isConsumed: true },
      });

      return job;
    });

    /* --------------------------------
       6. Success response
    --------------------------------- */
    return NextResponse.json(
      { success: true, job: result },
      { status: 201 }
    );
  } catch (error: unknown) {
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
      applications: {
        select: { id: true },
      },
    },
  });

  return NextResponse.json({
    jobs: jobs.map((job) => ({
      ...job,
      applicationsCount: job.applications.length,
    })),
  });
}
