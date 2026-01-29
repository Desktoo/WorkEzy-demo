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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ candidateId: string }> }
) {
  try {
    const { candidateId } = await params;
    const body = await req.json();

    const {
      fullName,
      email,
      phoneNumber,
      gender,
      dateOfBirth,
      age,
      highestEducation,
      educationSpecialization,
      industry,
      yearsOfExperience,
      skills,
      languages,
      noticePeriod,
      city,
      state,
      country,
      photo,
    } = body;

    const candidate = await prisma.candidate.update({
      where: { id: candidateId },
      data: {
        fullName,
        email,
        phoneNumber,
        gender,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        age,
        highestEducation,
        educationSpecialization,
        industry,
        yearsOfExperience,
        noticePeriod,
        city,
        state,
        country,
        photo,

        /* 🔁 Replace relations safely */
        skills: {
          deleteMany: {},
          create: (skills ?? []).map((name: string) => ({ name })),
        },

        languages: {
          deleteMany: {},
          create: (languages ?? []).map((languageName: string) => ({
            languageName,
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      candidate,
    });
  } catch (error) {
    console.error("Candidate PATCH failed:", error);

    return NextResponse.json(
      { message: "Failed to update candidate profile" },
      { status: 500 }
    );
  }
}

