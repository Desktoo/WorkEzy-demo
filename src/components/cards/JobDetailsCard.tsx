"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  MapPin,
  Building2,
  Users,
} from "lucide-react";

type Props = {
  job: {
    jobTitle: string;
    companyName: string;
    city: string;
    state: string;
    status: "ACTIVE" | "PENDING" | "EXPIRED";
    jobDescription: string;
    benefits: string[];
    filteringQuestions: {
      id: string;
      question: string;
      idealAnswer: boolean;
    }[];
    applicationsCount: number;
  };
};

export function JobDetailsAndScreeningCard({ job }: Props) {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{job.jobTitle}</h1>

            <div className="mt-2 flex flex-col gap-1 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>{job.companyName}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>
                  {job.city}, {job.state}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <span className={`rounded-full ${job.status === "ACTIVE" ? "bg-green-600" : "bg-yellow-500"}  px-3 py-1 text-xs font-semibold text-white`}>
              {job.status}
            </span>

            <Button variant="outline" className="flex gap-2">
              <Users className="h-4 w-4" />
              View Candidates ({job.applicationsCount})
            </Button>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Job Description
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <p>{job.jobDescription}</p>

        <Separator />

        <div>
          <p className="font-semibold text-lg mb-3">
            Benefits Offered
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {job.benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2">
                <CheckCircle className="text-green-600 h-4 w-4" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <p className="font-semibold text-lg mb-3">
            Screening Questions
          </p>

          {job.filteringQuestions.map((q) => (
            <QuestionRow
              key={q.id}
              question={q.question}
              idealYes={q.idealAnswer}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function QuestionRow({
  question,
  idealYes,
}: {
  question: string;
  idealYes: boolean;
}) {
  return (
    <div className="flex justify-between items-center border rounded-lg px-4 py-3 mb-2">
      <span>{question}</span>
      {idealYes ? (
        <CheckCircle className="text-green-600 h-4 w-4" />
      ) : (
        <XCircle className="text-red-500 h-4 w-4" />
      )}
    </div>
  );
}
