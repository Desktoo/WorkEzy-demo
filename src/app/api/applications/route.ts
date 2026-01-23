import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type FilteringAnswerInput = {
  questionId: string;
  answer: string;
};

type ApplyJobPayload = {
  jobId: string;
  candidateId: string;
  filteringAnswers?: FilteringAnswerInput[];
};


export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ApplyJobPayload;

    const {
      jobId,
      candidateId,
      filteringAnswers = [],
    } = body;

    // 🔐 Safety checks
    if (!jobId || !candidateId) {
      return NextResponse.json(
        { message: "Job ID and Candidate ID are required" },
        { status: 400 }
      );
    }

    // 🚀 TRANSACTION (CRITICAL)
    const application = await prisma.$transaction(async (tx) => {
      // 1️⃣ Create application
      const app = await tx.application.create({
        data: {
          jobId,
          candidateId,
        },
      });

      // 2️⃣ Save filtering answers (if any)
      if (filteringAnswers.length > 0) {
        const questions =
          await tx.jobFilteringQuestion.findMany({
            where: { jobId },
          });

        const questionMap = new Map<string, string>(
          questions.map((q) => [q.id, q.expectedAnswer])
        );

        await tx.applicationFilteringAnswer.createMany({
          data: filteringAnswers.map((fa: any) => ({
            applicationId: app.id,
            questionId: fa.questionId,
            candidateAnswer: fa.answer,
            isCorrect:
              fa.answer.toLowerCase() ===
              questionMap.get(fa.questionId)?.toLowerCase(),
          })),
        });

        await tx.application.update({
          where: { id: app.id },
          data: { status: "AI_SCREENED" },
        });
      }

      return app;
    });

    return NextResponse.json(
      { success: true, application },
      { status: 201 }
    );
  } catch (error) {
    console.error("Application POST error:", error);
    return NextResponse.json(
      { message: "Failed to apply for job" },
      { status: 500 }
    );
  }
}
