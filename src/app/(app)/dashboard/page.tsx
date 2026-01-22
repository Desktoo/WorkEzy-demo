"use client";

import { useEffect, useState } from "react";
import JobListingCard from "@/components/cards/JobListingCard";
import NoActiveJobCard from "@/components/cards/NoActiveJobCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CircleAlert, CirclePlus } from "lucide-react";
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

  const handlePostJobClick = async () => {
    try {
      const { data } = await axios.get("/api/job/can-post");

      if (data.canPost) {
        router.push("/dashboard/post-job");
        return;
      }

      toast(`Active plan required to post a job \n Redirecting to Pricing Section`, { icon: <CircleAlert className="w-8 h-8" /> });

      setTimeout(() => router.push("/pricing"), 2000);
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col py-5">
      <div className="border-b pb-4 mb-4 px-4 flex justify-between">
        <h1 className="text-xl font-bold">Dashboard</h1>

        <Button className="flex gap-2 items-center" onClick={handlePostJobClick}>
          <CirclePlus />
          Post New Job
        </Button>
      </div>

      {jobs.length > 0 ? (
        <Card className="mx-5 my-4 px-4 flex flex-col gap-6">
          <h1 className="text-xl font-bold">Your Job Postings</h1>

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
