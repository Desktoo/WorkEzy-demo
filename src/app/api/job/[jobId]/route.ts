import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";


type FilteringQuestionInput = {
  question: string;
  expectedAnswer: "yes" | "no";
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { userId } = await auth();
    const { jobId } = await params;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const employer = await prisma.employer.findUnique({
      where: { clerkId: userId },
      select: { id: true, companyName: true },
    });

    if (!employer) {
      return NextResponse.json(
        { message: "Employer not found" },
        { status: 404 }
      );
    }

    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        employerId: employer.id, // 🔐 ownership check
      },
      include: {
        filteringQuestions: true,
        applications: {
          select: { id: true },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({
      job: {
        ...job,
        applicationsCount: job.applications.length,
        companyName: employer.companyName,
      },
    });
  } catch (error) {
    console.error("[GET_JOB_BY_ID_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to fetch job details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await context.params;

  function parseISOToDate(value: unknown): Date {
    if (typeof value !== "string") {
      throw new Error("Invalid DateTime value");
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid DateTime format");
    }
    return date;
  }

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const employer = await prisma.employer.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!employer) {
      return NextResponse.json({ message: "Employer not found" }, { status: 404 });
    }

    const existingJob = await prisma.job.findFirst({
      where: { id: jobId, employerId: employer.id },
    });

    if (!existingJob) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        jobTitle: body.jobTitle,
        city: body.city,
        state: body.state,
        minExperience: body.minExperience,
        minEducation: body.minEducation,
        jobType: body.jobType,
        locationType: body.locationType,
        minSalary: body.minSalary,
        maxSalary: body.maxSalary,
        startTime: parseISOToDate(body.startTime),
        endTime: parseISOToDate(body.endTime),
        daysPerWeek: body.daysPerWeek,
        benefits: body.benefits ?? [],
        jobDescription: body.jobDescription,

        filteringQuestions: {
          deleteMany: { jobId },
          create: (body.filteringQuestions ?? []).map((q: FilteringQuestionInput) => ({
            question: q.question,
            expectedAnswer: q.expectedAnswer === "no" ? "no" : "yes",
          })),
        },
      },
    });

    return NextResponse.json({ job: updatedJob });
  } catch (error) {
    console.error("🔥 PATCH JOB ERROR 🔥", error);
    return NextResponse.json(
      { message: "Failed to update job" },
      { status: 500 }
    );
  }
}

