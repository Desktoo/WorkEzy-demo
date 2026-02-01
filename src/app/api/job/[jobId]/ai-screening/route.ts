import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/* ✅ Correct transaction type (no Prisma import) */
type PrismaTx = Parameters<typeof prisma.$transaction>[0] extends (
  prisma: infer T,
) => any
  ? T
  : never;

/* ---------------- Helper types ---------------- */

type ScreeningQuestionInput = {
  question: string;
  expectedAnswer: string;
};

type ApplicationRow = {
  id: string;
  aiAttempts: number;
};

type JobQuestionRow = {
  id: string;
};

const MAX_AI_ATTEMPTS = 2;

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
    applicationIds,
  }: {
    questions: ScreeningQuestionInput[];
    applicationIds: string[];
  } = await req.json();

  if (
    !Array.isArray(questions) ||
    !Array.isArray(applicationIds) ||
    questions.length === 0 ||
    applicationIds.length === 0
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
      plan: true,
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
  if (job.creditsUsed + applicationIds.length > job.totalCredits) {
    return NextResponse.json(
      { error: "Insufficient credits" },
      { status: 403 },
    );
  }

  /* --------------------------------
     5. AI attempt limit check (BEFORE transaction)
  --------------------------------- */
  const applications: ApplicationRow[] = await prisma.application.findMany({
    where: {
      jobId: job.id,
      id: { in: applicationIds },
    },
    select: {
      id: true,
      aiAttempts: true,
    },
  });

  const blockedApplication = applications.find(
    (a) => a.aiAttempts >= MAX_AI_ATTEMPTS,
  );

  if (blockedApplication) {
    return NextResponse.json(
      { error: "AI attempt limit reached for one or more candidates" },
      { status: 403 },
    );
  }

  /* --------------------------------
     6. Transaction (mutations only)
  --------------------------------- */
  await prisma.$transaction(async (tx: PrismaTx) => {
    /* 6.1 Create AI screening questions */
    await tx.jobAiScreeningQuestion.createMany({
      data: questions.map((q) => ({
        jobId: job.id,
        question: q.question,
        expectedAnswer: q.expectedAnswer,
      })),
    });

    /* 6.2 Fetch ONLY latest questions */
    const jobQuestions: JobQuestionRow[] =
      await tx.jobAiScreeningQuestion.findMany({
        where: {
          jobId: job.id,
        },
        orderBy: { createdAt: "desc" },
        take: questions.length,
        select: { id: true },
      });

    /* 6.3 Create empty CandidateAiAnswer entries */
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

    console.log("AI Questions:", jobQuestions.length);
    console.log("Applications:", applications.length);
    console.log("Answer rows:", answerRows.length);

    if (answerRows.length > 0) {
      await tx.candidateAiAnswer.createMany({
        data: answerRows,
        skipDuplicates: true,
      });
    }

    /* 6.4 Update application status + increment AI attempts */
    await tx.application.updateMany({
      where: {
        id: { in: applications.map((a) => a.id) },
      },
      data: {
        status: "AI_SCREENED",
        aiAttempts: { increment: 1 },
      },
    });

    /* 6.5 Deduct credits */
    await tx.job.update({
      where: { id: job.id },
      data: {
        creditsUsed: {
          increment: applications.length,
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
