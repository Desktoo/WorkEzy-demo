"use client";

import { useEffect, useState } from "react";
import JobListingCard from "@/components/cards/JobListingCard";
import NoActiveJobCard from "@/components/cards/NoActiveJobCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CircleAlert, CirclePlus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { getEmployerJobs } from "@/services/job.service";

export default function Page() {
  const [jobs, setJobs] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    getEmployerJobs()
      .then(setJobs)
      .catch(() => toast.error("Failed to load jobs"));
  }, []);



  return (
    <div className="flex flex-col py-5">
      <div className="border-b pb-4 mb-4 px-4 flex justify-between">
        <h1 className="text-xl font-bold">Dashboard</h1>

        <Button
          className="flex gap-2 items-center"
          onClick={() => router.push("/dashboard/post-job")}
        >
          <CirclePlus />
          Post New Job
        </Button>
      </div>

      {jobs.length > 0 ? (
        <Card className="mx-5 my-4 px-4 flex flex-col gap-6">
          <h1 className="text-xl font-bold ml-2">Your Job Postings</h1>

          {jobs.map((job) => (
            <JobListingCard key={job.id} {...job} />
          ))}
        </Card>
      ) : (
        <NoActiveJobCard
          title="Your Job Postings"
          description="You haven't posted any jobs yet."
        />
      )}
    </div>
  );
}
