import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkFilteredCandidates } from "@/services/algorithm/checkFilteredCandidates";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json(
        { message: "Job ID is required" },
        { status: 400 }
      );
    }

    // 1️⃣ Fetch filtering questions for the job
    const filteringQuestions = await prisma.jobFilteringQuestion.findMany({
      where: { jobId },
      select: {
        id: true,
        expectedAnswer: true,
      },
    });

    // 2️⃣ Fetch applications with candidate answers
    const applications = await prisma.application.findMany({
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
      },
    });

    // 3️⃣ Compute filtering result per application
    const result = applications.map((application) => {
      const { right, wrong, isFiltered } = checkFilteredCandidates(
        filteringQuestions,
        application.filteringAnswers
      );

      const totalAnswered = right + wrong;

      return {
        id: application.id,
        status: application.status,
        candidate: application.candidate,
        filteringStats: {
          totalQuestions: filteringQuestions.length,
          answered: totalAnswered,
          right,
          wrong,
          isFiltered,
        },
      };
    });


    console.log("this is the data coming from the DB: ", result)

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching filtered candidates:", error);

    return NextResponse.json(
      { message: "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}
