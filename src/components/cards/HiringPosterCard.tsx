"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, IndianRupee } from "lucide-react";
import { useRouter } from "next/navigation";

type HiringPosterCardProps = {
  jobId: string;
  jobTitle: string;
  location: string;
  salaryRange: string;
  postedOn: Date;
  expiresOn: Date;
};

export function HiringPosterCard({
  jobId,
  jobTitle,
  location,
  salaryRange,
  postedOn,
  expiresOn,
}: HiringPosterCardProps) {
  const router = useRouter();

  return (
    <Card className="w-full max-w-xl bg-amber-500">
      <CardContent className="p-6 space-y-5">
        {/* Job Title */}
        <h2 className="text-xl font-bold">{jobTitle}</h2>

        {/* Meta Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>

          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4" />
            <span>{salaryRange}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              Posted on:{" "}
              {postedOn.toLocaleDateString("en-IN")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              Expires on:{" "}
              {expiresOn.toLocaleDateString("en-IN")}
            </span>
          </div>
        </div>

        {/* Action */}
        <Button
          className="w-full bg-[#BE4145] hover:bg-[#a3363a] text-white mt-4"
          onClick={() =>
            router.push(`/hiring-poster/${jobId}/edit-poster`)
          }
        >
          Create Hiring Poster
        </Button>
      </CardContent>
    </Card>
  );
}
