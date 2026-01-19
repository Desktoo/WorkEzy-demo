import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

import { JobDetailsAndScreeningCard } from "@/components/cards/JobDetailsCard";
import { JobOverviewCard } from "@/components/cards/JobOverviewCard";
import { ShareableLinkCard } from "@/components/cards/SharableLinkCard";

export default async function Page(props: { params: Promise<{ jobId: string }> }) {

  const { jobId } = await props.params;

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const employer = await prisma.employer.findUnique({
    where: { clerkId: userId },
    select: { id: true, companyName: true },
  });

  if (!employer) redirect("/dashboard");

  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      employerId: employer.id,
    },
    include: {
      filteringQuestions: true,
      applications: { select: { id: true } },
    },
  });

  if (!job) redirect("/dashboard");

  const applyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/apply/${job.id}`;

  const formattedFilteringQuestions = job.filteringQuestions.map((q) => ({
    id: q.id,
    question: q.question,
    idealAnswer: q.expectedAnswer.toLowerCase() === "yes",
  }));

  return (
    <div className="min-h-screen flex flex-col my-5">
      <div className="border-b pb-4 mb-4 px-4">
        <h1 className="text-xl font-bold">Job Details</h1>
      </div>

      <div className="flex justify-between items-center px-4">
        <Link href="/dashboard">
          <Button className="flex items-center gap-1 bg-transparent text-gray-500 hover:text-black hover:bg-transparent">
            <ArrowLeft />
            Back to Dashboard
          </Button>
        </Link>

        <Link href={`/dashboard/edit-job/${job.id}`}>
          <Button className="bg-transparent hover:bg-gray-200 text-gray-500 border">
            <Edit />
            Edit Job
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 my-5 lg:grid-cols-3 px-4 gap-8">
        <div className="lg:col-span-2">
          <JobDetailsAndScreeningCard
            job={{
              jobTitle: job.jobTitle,
              companyName: employer.companyName,
              city: job.city,
              state: job.state,
              status: job.status,
              jobDescription: job.jobDescription,
              benefits: job.benefits,
              filteringQuestions: formattedFilteringQuestions,
              applicationsCount: job.applications.length,
            }}
          />
        </div>

        <div className="flex flex-col gap-6">
          {job.status === "ACTIVE" && <ShareableLinkCard applyUrl={applyUrl} />}
          <JobOverviewCard
            job={{
              minSalary: job.minSalary,
              maxSalary: job.maxSalary,
              jobType: job.jobType,
              locationType: job.locationType,
              minExperience: job.minExperience,
              minEducation: job.minEducation,
              startTime: job.startTime,
              endTime: job.endTime,
              daysPerWeek: job.daysPerWeek,
            }}
          />
        </div>
      </div>
    </div>
  );
}
