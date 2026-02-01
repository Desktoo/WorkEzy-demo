import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkFilteredCandidates } from "@/services/algorithm/checkFilteredCandidates";

/* ---------------- Helper types (structural, minimal) ---------------- */

type FilteringQuestion = {
  id: string;
  question: string;
  expectedAnswer: string;
};

type FilteringAnswer = {
  questionId: string;
  candidateAnswer: string;
};

type ApplicationWithAnswers = {
  id: string;
  status: string;
  aiAttempts: number;
  candidate: {
    skills: unknown[];
    languages: unknown[];
  };
  filteringAnswers: FilteringAnswer[];
  aiAnswers: {
    candidateAnswer: string | null;
    question: {
      id: string;
      question: string;
      expectedAnswer: string;
    };
  }[];
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  try {
    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json(
        { message: "Job ID is required" },
        { status: 400 },
      );
    }

    /* 1️⃣ Fetch filtering questions */
    const filteringQuestions: FilteringQuestion[] =
      await prisma.jobFilteringQuestion.findMany({
        where: { jobId },
        select: {
          id: true,
          question: true,
          expectedAnswer: true,
        },
      });

    /* 2️⃣ Fetch applications with answers */
    const applications: ApplicationWithAnswers[] =
      await prisma.application.findMany({
        where: { jobId },
        orderBy: { appliedAt: "desc" },
        include: {
          candidate: {
            include: {
              skills: true,
              languages: true,
            },
          },
          filteringAnswers: {
            select: {
              questionId: true,
              candidateAnswer: true,
            },
          },
          aiAnswers: {
            include: {
              question: {
                select: {
                  id: true,
                  question: true,
                  expectedAnswer: true,
                },
              },
            },
          },
        },
      });

    /* 3️⃣ Compute filtering result */
    const result = applications.map((application) => {
      const { right, wrong, isFiltered } = checkFilteredCandidates(
        filteringQuestions,
        application.filteringAnswers,
      );

      const totalAnswered = right + wrong;

      return {
        id: application.id,
        status: application.status,
        aiAttempts: application.aiAttempts,
        candidate: application.candidate,
        filteringStats: {
          totalQuestions: filteringQuestions.length,
          answered: totalAnswered,
          right,
          wrong,
          isFiltered,
        },
        filteringQA: filteringQuestions.map((q) => {
          const answer = application.filteringAnswers.find(
            (a) => a.questionId === q.id,
          );

          return {
            questionId: q.id,
            question: q.question,
            expectedAnswer: q.expectedAnswer,
            candidateAnswer: answer?.candidateAnswer ?? null,
            isCorrect: answer?.candidateAnswer === q.expectedAnswer,
          };
        }),
        aiQA: application.aiAnswers.map((ans) => ({
          id: ans.question.id,
          question: ans.question.question,
          expectedAnswer: ans.question.expectedAnswer,
          candidateAnswer: ans.candidateAnswer,
          isCorrect:
            ans.candidateAnswer?.trim().toLowerCase() ===
            ans.question.expectedAnswer.trim().toLowerCase(),
        })),
      };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching filtered candidates:", error);

    return NextResponse.json(
      { message: "Failed to fetch candidates" },
      { status: 500 },
    );
  }
}
