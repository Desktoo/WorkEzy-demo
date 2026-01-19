import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await context.params; // ✅ REQUIRED

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      filteringQuestions: {
        select: { id: true, question: true },
      },
      employer: {
        select: { companyLogo: true },
      },
    },
  });

  if (!job) {
    return NextResponse.json({ message: "Job not found" }, { status: 404 });
  }

  console.log("filteringQuestions are here:", job.filteringQuestions);

  return NextResponse.json({
    companyLogo: job.employer?.companyLogo ?? null,
    filteringQuestions: job.filteringQuestions,
  });
}
