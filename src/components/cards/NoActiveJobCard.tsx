"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, CircleAlert, CirclePlus } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  title: string;
  description: string;
};

export default function NoActiveJobCard({ title, description }: Props) {

  const router = useRouter()

  return (
    <Card className="w-full max-w-xl mx-auto rounded-xl">
      <CardContent className="flex flex-col gap-6">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-black text-center">
          {title}
        </h2>

        <div className="flex flex-col justify-center items-center gap-2">
          {/* Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Briefcase className="h-8 w-8 text-[#BE4145]" />
          </div>

          {/* Empty state text */}
          <div className="space-y-1 text-center">
            <p className="text-lg font-medium text-gray-800">
              No active jobs found.
            </p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        {/* CTA */}
          <Button onClick={() => router.push("/dashboard/post-job")} className="mt-4 flex w-full items-center gap-2 bg-[#BE4145] px-6 py-5 text-white hover:bg-[#a7373b]">
            <CirclePlus className="h-4 w-4" />
            Post a Job
          </Button>
      </CardContent>
    </Card>
  );
}
