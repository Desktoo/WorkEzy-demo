import { prisma } from "@/lib/prisma";
import { candidateBackendSchema } from "@/lib/validations/backend/candidateApplyBackend.schema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    /* --------------------------------
       1. Parse body
    --------------------------------- */
    const body = await req.json();
    const { jobId, filteringAnswers = [], ...candidatePayload } = body;

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: "jobId is required" },
        { status: 400 }
      );
    }

    /* --------------------------------
       2. Validate candidate data
    --------------------------------- */
    const validated = candidateBackendSchema.parse(candidatePayload);

    const {
      skills = [],
      languages = [],
      dateOfBirth,
      ...candidateData
    } = validated;

    /* --------------------------------
       3. Find candidate by phone
    --------------------------------- */
    let candidate = await prisma.candidate.findUnique({
      where: { phoneNumber: candidateData.phoneNumber },
    });

    /* --------------------------------
       4. Create OR update candidate
    --------------------------------- */
    if (!candidate) {
      candidate = await prisma.candidate.create({
        data: {
          ...candidateData,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,

          skills: {
            create: skills.map((name: string) => ({ name })),
          },

          languages: {
            create: languages.map((languageName: string) => ({
              languageName,
            })),
          },
        },
      });
    } else {
      candidate = await prisma.candidate.update({
        where: { id: candidate.id },
        data: {
          ...candidateData,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,

          skills: {
            deleteMany: {},
            create: skills.map((name: string) => ({ name })),
          },

          languages: {
            deleteMany: {},
            create: languages.map((languageName: string) => ({
              languageName,
            })),
          },
        },
      });
    }

    /* --------------------------------
       5. Create application
       (unique-safe)
    --------------------------------- */
    let application;

    try {
      application = await prisma.application.create({
        data: {
          jobId,
          candidateId: candidate.id,
        },
      });
    } catch (error: any) {
      if (error?.code === "P2002") {
        return NextResponse.json(
          {
            success: false,
            message: "Candidate has already applied for this job",
          },
          { status: 409 }
        );
      }
      throw error;
    }

    /* --------------------------------
       6. Store filtering answers
    --------------------------------- */
    if (filteringAnswers.length > 0) {
      await prisma.applicationFilteringAnswer.createMany({
        data: filteringAnswers.map(
          (answer: {
            questionId: string;
            answer: string;
          }) => ({
            applicationId: application.id,
            questionId: answer.questionId,
            candidateAnswer: answer.answer,
            isCorrect: false, 
          })
        ),
      });
    }

    /* --------------------------------
       7. Response
    --------------------------------- */
    return NextResponse.json(
      {
        success: true,
        candidateId: candidate.id,
        applicationId: application.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Candidate apply error:", error);

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
      {
        success: false,
        message: "Failed to apply for job",
      },
      { status: 500 }
    );
  }
}
