import { prisma } from "@/lib/prisma";
import Image from "next/image";

import { JobApplyCard } from "@/components/cards/JobApplyCard";
import { NoJobFoundCard } from "@/components/cards/NoJobFoundCard";

/* ---------------- Page ---------------- */

export default async function Page(props: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await props.params;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    return (
      <ApplyLayout>
        <NoJobFoundCard />
      </ApplyLayout>
    );
  }

  /* --------- Map DB → UI Shape --------- */

  const formatTime = (date: Date) => {
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return {
      hour: String(hours),
      minute: minutes,
      period,
    };
  };

  return (
    <ApplyLayout>
      <JobApplyCard
        jobId={job.id}
        job={{
          jobTitle: job.jobTitle,
          city: job.city,
          state: job.state,
          jobType: job.jobType,
          locationType: job.locationType,
          salaryFrom: job.minSalary,
          salaryTo: job.maxSalary,
          officeTimeFrom: formatTime(job.startTime),
          officeTimeTo: formatTime(job.endTime),
          daysPerWeek: job.daysPerWeek,
          minExperience: job.minExperience,
          minEducation: job.minEducation,
          jobDescription: job.jobDescription,
        }}
        benefits={job.benefits ?? []}
      />
    </ApplyLayout>
  );
}

/* ---------------- Layout Wrapper ---------------- */

function ApplyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30 py-12 flex flex-col items-center">
      {/* Header */}
      <header className="h-20 flex items-center justify-center border-b w-full">
        <div className="relative h-28 w-28 rounded-full overflow-hidden bg-gray-100">
          <Image
            src="/assets/workezy-logo.png"
            alt="workezy"
            fill
            className="object-contain p-1"
          />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 w-full flex items-center justify-center px-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="pb-6 text-sm text-muted-foreground">
        Powered by{" "}
        <span className="font-semibold text-black">
          work<span className="text-[#BE4145]">ezy</span>
        </span>
      </footer>
    </div>
  );
}
