"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Building2,
  Briefcase,
  GraduationCap,
  Clock,
  Users,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ---------------- Types ---------------- */

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
  createdAt: Date;
  expiresAt: Date;
  status: "ACTIVE" | "PENDING" | "EXPIRED" | "REJECTED";
  applicationsCount: number;
};

/* ---------------- Helpers ---------------- */

const formatDate = (date: Date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const STATUS_COLOR: Record<JobListingCardProps["status"], string> = {
  ACTIVE: "bg-green-600/30 border-green-800 border-2 text-green-800",
  PENDING: "bg-yellow-500/30 border-yellow-800 border-2 text-yellow-800",
  EXPIRED: "bg-gray-400/30 border-gray-500 border-2 text-gray-500",
  REJECTED: "bg-red-600/30 border-red-800 border-2 text-red-800",
};

/* ---------------- Component ---------------- */

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
  createdAt,
  expiresAt,
  applicationsCount,
}: JobListingCardProps) {
  const router = useRouter();

  return (
    <Card className="w-full rounded-xl">
      {/* Header */}
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-bold">{jobTitle}</h2>
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <MapPin className="h-4 w-4" />
            {city}, {state}
          </div>
        </div>

        <Badge className={`${STATUS_COLOR[status]} px-3 py-1 rounded-full`}>
          {status}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Meta */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <Meta icon={<Building2 className="w-5 h-5" />} label="Location Type" value={locationType} />
          <Meta icon={<Briefcase className="w-5 h-5" />} label="Experience" value={minExperience} />
          <Meta icon={<GraduationCap className="w-5 h-5" />} label="Education" value={minEducation} />
          <Meta icon={<Clock className="w-5 h-5" />} label="Job Type" value={jobType} />
          <Meta icon={<Calendar className="w-5 h-5" />} label="Posted on" value={formatDate(createdAt)} />
          <Meta icon={<Calendar className="w-5 h-5" />} label="Expires on" value={formatDate(expiresAt)} />
        </div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t pt-4">
          <p className="text-lg font-semibold text-[#BE4145]">
            ₹{minSalary} – ₹{maxSalary} / month
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex gap-2"
              onClick={() => router.push(`/dashboard/job/${id}/candidates`)}
            >
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

/* ---------------- Helper ---------------- */

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
    <div className="flex gap-2">
      <div className="h-5 w-5 text-[#BE4145]">{icon}</div>
      <div className="flex flex-col gap-0.5">
        <p className="font-semibold">{label}</p>
        <p className="text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}
