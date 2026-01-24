import { prisma } from "@/lib/prisma";
import { HiringPosterCard } from "@/components/cards/HiringPosterCard";
import NoActiveJobCard from "@/components/cards/NoActiveJobCard";
import { auth } from "@clerk/nextjs/server";

/* 👇 derive the exact return type */
type JobPoster = {
  id: string;
  jobTitle: string;
  city: string;
  state: string;
  minSalary: string;
  maxSalary: string;
  createdAt: Date;
  expiresAt: Date;
};

export default async function Page() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const employer = await prisma.employer.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!employer) throw new Error("Employer not found");
  // 🔹 Fetch all ACTIVE jobs
  const jobs = await prisma.job.findMany({
    where: {
      status: "ACTIVE",
      employerId: employer.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      jobTitle: true,
      city: true,
      state: true,
      minSalary: true,
      maxSalary: true,
      createdAt: true,
      expiresAt: true,
    },
  });

  const hasJobs = jobs.length > 0;

  return (
    <div className="min-h-screen flex flex-col my-5">
      {/* Header */}
      <div className="border-b pb-4 mb-10 px-4">
        <h1 className="text-2xl font-bold">Hiring Poster</h1>
      </div>

      {hasJobs ? (
        <div className="px-4 grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {jobs.map((job: JobPoster) => (
            <HiringPosterCard
              key={job.id}
              jobId={job.id}
              jobTitle={job.jobTitle}
              location={`${job.city}, ${job.state}`}
              salaryRange={`${job.minSalary} - ${job.maxSalary}`}
              postedOn={job.createdAt}
              expiresOn={job.expiresAt}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center px-4">
          <NoActiveJobCard
            title="Create a Hiring Poster"
            description="You need at least one active job to create a hiring poster."
          />
        </div>
      )}
    </div>
  );
}
