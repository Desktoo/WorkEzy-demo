import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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