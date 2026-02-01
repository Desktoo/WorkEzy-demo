import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const client = await clerkClient();

export async function DELETE() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1️⃣ Find employer by Clerk ID
  const employer = await prisma.employer.findUnique({
    where: { clerkId: userId },
    include: {
      jobs: {
        include: {
          applications: {
            include: {
              candidate: true,
            },
          },
        },
      },
    },
  });

  if (!employer) {
    return NextResponse.json(
      { error: "Employer not found" },
      { status: 404 }
    );
  }

  await prisma.$transaction(async (tx) => {
    /* ---------------- Archive Employer ---------------- */
    await tx.archivedUser.create({
      data: {
        originalId: employer.id,
        role: "EMPLOYER",
        fullName: employer.fullName,
        email: employer.email,
        phoneNumber: null,
        gender: employer.gender,
        city: employer.city,
        state: employer.state,
        country: employer.country,
        companyName: employer.companyName,
        designation: employer.designation,
        industry: employer.industry,
      },
    });

    /* ---------------- Archive Candidates ---------------- */
    const uniqueCandidates = new Map<string, any>();

    employer.jobs.forEach((job) => {
      job.applications.forEach((app) => {
        uniqueCandidates.set(app.candidate.id, app.candidate);
      });
    });

    for (const candidate of uniqueCandidates.values()) {
      await tx.archivedUser.create({
        data: {
          originalId: candidate.id,
          role: "CANDIDATE",
          fullName: candidate.fullName,
          email: candidate.email,
          phoneNumber: candidate.phoneNumber,
          gender: candidate.gender,
          city: candidate.city,
          state: candidate.state,
          country: candidate.country,
          industry: candidate.industry,
        },
      });
    }

    /* ---------------- Hard delete everything ---------------- */
    await tx.candidateAiAnswer.deleteMany({
      where: { application: { job: { employerId: employer.id } } },
    });

    await tx.applicationFilteringAnswer.deleteMany({
      where: { application: { job: { employerId: employer.id } } },
    });

    await tx.application.deleteMany({
      where: { job: { employerId: employer.id } },
    });

    await tx.jobAiScreeningQuestion.deleteMany({
      where: { job: { employerId: employer.id } },
    });

    await tx.jobFilteringQuestion.deleteMany({
      where: { job: { employerId: employer.id } },
    });

    await tx.job.deleteMany({
      where: { employerId: employer.id },
    });

    await tx.payment.deleteMany({
      where: { employerId: employer.id },
    });

    await tx.employer.delete({
      where: { id: employer.id },
    });
  });

  /* ---------------- Delete Clerk User ---------------- */
  await client.users.deleteUser(userId);

  return NextResponse.json({ success: true });
}
