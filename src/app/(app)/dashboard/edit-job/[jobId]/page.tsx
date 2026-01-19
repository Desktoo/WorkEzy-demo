import PostJobForm from "@/components/Forms/PostJobForm/PostJobForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { mapJobToPostJobForm } from "@/lib/mappers/job.mapper";

export default async function Page({
  params,
}: {
  params: { jobId: string };
}) {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const employer = await prisma.employer.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!employer) redirect("/pricing");

  const job = await prisma.job.findFirst({
    where: {
      id: params.jobId,
      employerId: employer.id,
    },
    include: {
      filteringQuestions: true,
    },
  });

  if (!job) redirect("/dashboard");

  return (
    <div className="flex flex-col gap-5 py-5">
      <div className="border-b pb-4 px-4">
        <h1 className="text-xl font-bold">Edit Job</h1>
      </div>

      <div className="px-4">
        <Link href="/dashboard">
          <Button variant="ghost">
            <ArrowLeft /> Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="px-4 pb-20">
        <div className="max-w-3xl mx-auto">
          <PostJobForm
            mode="edit"
            jobId={job.id}
            initialData={mapJobToPostJobForm(job)}
          />
        </div>
      </div>
    </div>
  );
}
