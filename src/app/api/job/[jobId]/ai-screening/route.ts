import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/* ✅ Correct transaction type (no Prisma import) */
type PrismaTx = Parameters<typeof prisma.$transaction>[0] extends (
  prisma: infer T
) => any
  ? T
  : never;

/* ---------------- Map helper types ---------------- */

type ScreeningQuestionInput = {
  question: string;
  expectedAnswer: string;
};

type ApplicationRow = {
  id: string;
};

type JobQuestionRow = {
  id: string;
};

export async function POST(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params;

  /* --------------------------------
     1. Auth
  --------------------------------- */
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* --------------------------------
     2. Parse payload
  --------------------------------- */
  const {
    questions,
    candidateIds,
  }: {
    questions: ScreeningQuestionInput[];
    candidateIds: string[];
  } = await req.json();

  if (
    !Array.isArray(questions) ||
    !Array.isArray(candidateIds) ||
    questions.length === 0 ||
    candidateIds.length === 0
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  /* --------------------------------
     3. Verify job ownership
  --------------------------------- */
  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      employer: { clerkId: userId },
    },
    select: {
      id: true,
      totalCredits: true,
      creditsUsed: true,
    },
  });

  if (!job) {
    return NextResponse.json(
      { error: "Job not found or access denied" },
      { status: 404 },
    );
  }

  /* --------------------------------
     4. Credit check
  --------------------------------- */
  if (job.creditsUsed + candidateIds.length > job.totalCredits) {
    return NextResponse.json(
      { error: "Insufficient credits" },
      { status: 403 },
    );
  }

  /* --------------------------------
     5. Transaction
  --------------------------------- */
  await prisma.$transaction(async (tx: PrismaTx) => {
    /* 5.1 Create AI screening questions */
    await tx.jobAiScreeningQuestion.createMany({
      data: questions.map((q: ScreeningQuestionInput) => ({
        jobId: job.id,
        question: q.question,
        expectedAnswer: q.expectedAnswer,
      })),
    });

    /* 5.2 Fetch applications being screened */
    const applications: ApplicationRow[] =
      await tx.application.findMany({
        where: {
          jobId: job.id,
          candidateId: { in: candidateIds },
        },
        select: {
          id: true,
        },
      });

    /* 5.3 Fetch ONLY latest questions */
    const jobQuestions: JobQuestionRow[] =
      await tx.jobAiScreeningQuestion.findMany({
        where: {
          jobId: job.id,
          question: {
            in: questions.map(
              (q: ScreeningQuestionInput) => q.question
            ),
          },
        },
        select: { id: true },
      });

    /* 5.4 Create empty CandidateAiAnswer entries */
    const answerRows: {
      applicationId: string;
      questionId: string;
      candidateAnswer: null;
    }[] = [];

    for (const app of applications) {
      for (const q of jobQuestions) {
        answerRows.push({
          applicationId: app.id,
          questionId: q.id,
          candidateAnswer: null,
        });
      }
    }

    if (answerRows.length > 0) {
      await tx.candidateAiAnswer.createMany({
        data: answerRows,
        skipDuplicates: true,
      });
    }

    /* 5.5 Update application status */
    await tx.application.updateMany({
      where: {
        id: { in: applications.map((a: ApplicationRow) => a.id) },
      },
      data: {
        status: "AI_SCREENED",
      },
    });

    /* 5.6 Deduct credits */
    await tx.job.update({
      where: { id: job.id },
      data: {
        creditsUsed: {
          increment: candidateIds.length,
        },
      },
    });
  });

  return NextResponse.json({ success: true });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { jobId } = await params;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      jobTitle: true,
      totalCredits: true,
      creditsUsed: true,
    },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(job);
}
