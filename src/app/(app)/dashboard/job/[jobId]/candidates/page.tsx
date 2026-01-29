import { ArrowLeft } from "lucide-react";

import ApplicationCard from "@/components/cards/ApplicationCard";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CandidatesPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;

  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
    select: {
      plan: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!job?.plan?.name) {
    throw new Error("Job has no plan assigned");
  }

  const planName = job.plan.name;

  return (
    <div className="space-y-8 p-6">
      <Link
        href={"/dashboard"}
        className="hover:text-gray-600 py-2 flex gap-1 items-center text-sm"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Jobs
      </Link>

      <ApplicationCard plan={planName} jobId={jobId} />
    </div>
  );
}
