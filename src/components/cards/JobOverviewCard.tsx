"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  MapPin,
  Clock,
  BookOpen,
  BarChart,
  IndianRupee,
} from "lucide-react";

type Props = {
  job: {
    minSalary: string;
    maxSalary: string;
    jobType: string;
    locationType: string;
    minExperience: string;
    minEducation: string;
    startTime: Date;
    endTime: Date;
    daysPerWeek: string;
  };
};

export function JobOverviewCard({ job }: Props) {
  const formatTime = (date: Date) =>
    new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Job Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <OverviewItem
          icon={<IndianRupee />}
          label="Salary"
          value={`₹${job.minSalary} – ₹${job.maxSalary} / month`}
        />
        <OverviewItem
          icon={<Briefcase />}
          label="Job Type"
          value={job.jobType}
        />
        <OverviewItem
          icon={<MapPin />}
          label="Location Type"
          value={job.locationType}
        />
        <OverviewItem
          icon={<BarChart />}
          label="Min. Experience"
          value={`${job.minExperience} year(s)`}
        />
        <OverviewItem
          icon={<BookOpen />}
          label="Min. Education"
          value={job.minEducation}
        />
        <OverviewItem
          icon={<Clock />}
          label="Office Timings"
          value={`${formatTime(job.startTime)} – ${formatTime(job.endTime)}`}
        />
        <OverviewItem
          icon={<Clock />}
          label="Days per Week"
          value={`${job.daysPerWeek} days`}
        />
      </CardContent>
    </Card>
  );
}

function OverviewItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-muted-foreground mt-1">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
