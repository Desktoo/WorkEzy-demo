import { prisma } from "@/lib/prisma";
import { candidateBackendSchema } from "@/lib/validations/backend/candidateApplyBackend.schema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    /* --------------------------------
       1. Parse raw body
       CHANGE: jobId is NOT part of schema
    --------------------------------- */
    const body = await req.json();
    const { jobId, ...candidatePayload } = body;

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: "jobId is required" },
        { status: 400 }
      );
    }

    /* --------------------------------
       2. Validate candidate-only data
    --------------------------------- */
    const validatedData =
      candidateBackendSchema.parse(candidatePayload);

    const {
      skills = [],
      languages = [],
      ...candidateData
    } = validatedData;

    /* --------------------------------
       3. Find or create candidate
    --------------------------------- */
    let candidate = await prisma.candidate.findUnique({
      where: { phoneNumber: candidateData.phoneNumber },
    });

    if (!candidate) {
      candidate = await prisma.candidate.create({
        data: {
          ...candidateData,

          skills: {
            create: skills.map((skill: string) => ({
              name: skill,
            })),
          },

          languages: {
            create: languages.map((language: string) => ({
              languageName: language,
            })),
          },
        },
      });
    }

    /* --------------------------------
       4. Create application
    --------------------------------- */
    try {
      await prisma.application.create({
        data: {
          jobId,
          candidateId: candidate.id,
        },
      });
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "P2002"
      ) {
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

    return NextResponse.json(
      {
        success: true,
        candidateId: candidate.id,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
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
