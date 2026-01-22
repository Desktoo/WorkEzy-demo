import { prisma } from "@/lib/prisma";
import { evaluateAiScreening } from "@/services/algorithm/checkAIFitCandidates";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: { applicationId: string } }
) {
  /* --------------------------------
     1. Auth
  --------------------------------- */
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { applicationId } = params;

  /* --------------------------------
     2. Fetch application + ownership
  --------------------------------- */
  const application = await prisma.application.findFirst({
    where: {
      id: applicationId,
      job: {
        employer: { clerkId: userId },
      },
    },
    include: {
      aiAnswers: {
        include: {
          question: {
            select: { expectedAnswer: true },
          },
        },
      },
    },
  });

  if (!application) {
    return NextResponse.json(
      { error: "Application not found or access denied" },
      { status: 404 }
    );
  }

  /* --------------------------------
     3. Convert answers → isFit[]
  --------------------------------- */
  const evaluatedAnswers = application.aiAnswers.map((ans) => {
    if (!ans.candidateAnswer) {
      return { isFit: false };
    }

    return {
      isFit:
        ans.candidateAnswer.trim().toLowerCase() ===
        ans.question.expectedAnswer.trim().toLowerCase(),
    };
  });

  /* --------------------------------
     4. Final decision
  --------------------------------- */
  const result = evaluateAiScreening(evaluatedAnswers);

  if (!result.isFinal) {
    return NextResponse.json(
      { error: "AI answers incomplete" },
      { status: 400 }
    );
  }

  /* --------------------------------
     5. Update application status
  --------------------------------- */
  const newStatus = result.isFit
    ? "AI_FIT"
    : "AI_NOT_FIT";

  await prisma.application.update({
    where: { id: application.id },
    data: { status: newStatus },
  });

  return NextResponse.json({
    success: true,
    status: newStatus,
    fit: result.fit,
    notFit: result.notFit,
  });
}
