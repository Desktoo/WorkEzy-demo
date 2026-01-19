"use client";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Building2,
  Briefcase,
  GraduationCap,
  Clock,
  Users,
} from "lucide-react";
import Link from "next/link";

type JobListingCardProps = {
  id: string;
  jobTitle: string;
  city: string;
  state: string;
  locationType: string;
  minExperience: string;
  minEducation: string;
  jobType: string;
  minSalary: string;
  maxSalary: string;
  status: "ACTIVE" | "PENDING" | "EXPIRED";
  applicationsCount: number;
};

export default function JobListingCard({
  id,
  jobTitle,
  city,
  state,
  locationType,
  minExperience,
  minEducation,
  jobType,
  minSalary,
  maxSalary,
  status,
  applicationsCount,
}: JobListingCardProps) {
  const statusColor =
    status === "ACTIVE"
      ? "bg-green-600"
      : status === "PENDING"
      ? "bg-yellow-500"
      : "bg-gray-400";

  return (
    <Card className="w-full rounded-xl">
      {/* Header */}
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">{jobTitle}</h2>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <MapPin className="h-4 w-4" />
            {city}, {state}
          </div>
        </div>

        <Badge className={`${statusColor} text-white px-3 py-1 rounded-full`}>
          {status}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Meta */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <Meta icon={<Building2 />} label="Location Type" value={locationType} />
          <Meta icon={<Briefcase />} label="Experience" value={`${minExperience}`} />
          <Meta icon={<GraduationCap />} label="Education" value={minEducation} />
          <Meta icon={<Clock />} label="Job Type" value={jobType} />
        </div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t pt-4">
          <p className="text-lg font-semibold text-[#BE4145]">
            ₹{minSalary} – ₹{maxSalary} / month
          </p>

          <div className="flex gap-3">
            <Button variant="outline" className="flex gap-2">
              <Users className="h-4 w-4" />
              View Candidates ({applicationsCount})
            </Button>
            <Link href={`/dashboard/job/${id}`}>
            <Button variant="outline">View Details</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Meta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="h-5 w-5 text-[#BE4145]">{icon}</div>
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}
