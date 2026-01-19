"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  MapPin,
  Briefcase,
  Clock,
  Calendar,
  BarChart,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

type JobApplyCardProps = {
  job: any; // keep your existing job type
  benefits: string[];
  jobId: string;
};

export function JobApplyCard({ job, benefits, jobId }: JobApplyCardProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Card className="shadow-sm">
        {/* Header */}
        <CardHeader>
          <p className="text-primary font-semibold text-sm">Apply for</p>

          <CardTitle className="text-3xl font-bold">{job.jobTitle}</CardTitle>

          <CardDescription className="flex items-center gap-2 pt-1">
            <MapPin className="h-4 w-4" />
            {job.city}, {job.state}
          </CardDescription>
        </CardHeader>

        {/* Meta Info */}
        <CardContent>
          <div className="space-y-4 text-sm text-muted-foreground mb-6">
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <MetaItem
                icon={<Briefcase className="h-4 w-4" />}
                text={`${job.jobType} (${job.locationType})`}
              />

              <MetaItem
                icon={<span className="text-xl leading-none">₹</span>}
                text={`${job.salaryFrom} - ${job.salaryTo} / month`}
              />

              <MetaItem
                icon={<Clock className="h-4 w-4" />}
                text={`${job.officeTimeFrom.hour}:${job.officeTimeFrom.minute} ${job.officeTimeFrom.period} - ${job.officeTimeTo.hour}:${job.officeTimeTo.minute} ${job.officeTimeTo.period}`}
              />

              <MetaItem
                icon={<Calendar className="h-4 w-4" />}
                text={`${job.daysPerWeek} days/week`}
              />
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
              <MetaItem
                icon={<BarChart className="h-4 w-4" />}
                text={`Min. ${
                  job.minExperience === "0"
                    ? "Fresher"
                    : `${job.minExperience} years`
                } experience`}
              />

              <MetaItem
                icon={<BookOpen className="h-4 w-4" />}
                text={`Min. ${job.minEducation} education`}
              />
            </div>
          </div>

          <Separator />

          {/* Job Description */}
          <div className="py-6">
            <h3 className="text-xl font-bold mb-4 text-foreground">
              Job Description
            </h3>

            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {job.jobDescription}
            </p>
          </div>

          {/* Benefits */}
          {benefits.length > 0 && (
            <>
              <Separator />

              <div className="py-6">
                <h3 className="text-xl font-bold mb-4 text-foreground">
                  Benefits Offered
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>

        {/* Footer CTA */}
        <div className="p-6 pt-0">
          <Link href={`/apply/${jobId}/auth`} className="w-full block">
            <Button className="w-full text-lg">Apply Now</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

/* ---------- Small Helper ---------- */

function MetaItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span>{text}</span>
    </div>
  );
}
