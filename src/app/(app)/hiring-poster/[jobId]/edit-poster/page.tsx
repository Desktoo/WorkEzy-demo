import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditPosterClient from "./EditPosterClient";

type PageProps = {
  params: Promise<{
    jobId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { jobId } = await params;

  console.log("this is jobId: ", jobId)

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      jobTitle: true,
      city: true,
      state: true,
      minSalary: true,
      maxSalary: true,
      daysPerWeek: true,
      jobDescription: true,
    },
  });

  if (!job) notFound();

  return (
    <EditPosterClient
      jobId={jobId}
      initialData={{
        jobTitle: job.jobTitle,
        city: job.city,
        state: job.state,
        salaryFrom: job.minSalary,
        salaryTo: job.maxSalary,
        workingDays: job.daysPerWeek,
        requirementsText: job.jobDescription,
      }}
    />
  );
}
