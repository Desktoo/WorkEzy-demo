"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { useApplicationStore } from "@/store/applicationStore";

/* ---------------- Status helpers ---------------- */

const statusLabelMap = {
  APPLIED: "Applied",
  INTERESTED: "Interested",
  AI_SCREENED: "AI Screened",
  AI_FIT: "AI Fit",
  AI_NOT_FIT: "AI Not Fit",
};

const statusColorMap = {
  APPLIED: "bg-blue-500",
  INTERESTED: "bg-emerald-500",
  AI_SCREENED: "bg-purple-500",
  AI_FIT: "bg-green-600",
  AI_NOT_FIT: "bg-red-500",
};

/* ---------------- Component ---------------- */

export default function CandidateAccordionCard({
  applicationId,
  applicationStatus,
  candidate,
  isPremium,
  tab,
  filteringQA,
  AIScreeningQA = [],
}: {
  applicationId: string;
  applicationStatus: keyof typeof statusLabelMap;
  tab: "All" | "Filtered" | "AIScreened";
  candidate: {
    id: string;
    fullName: string;
    email?: string;
    phoneNumber: string;
    dateOfBirth?: string;
    age: number;
    highestEducation: string;
    educationSpecialization: string;
    noticePeriod: number;
    industry: string;
    yearsOfExperience: string;
    photo?: string;
    city: string;
    state: string;
    skills: { name: string }[];
    languages: { languageName: string }[];
  };
  filteringQA: {
    questionId: string;
    question: string;
    expectedAnswer: string;
    candidateAnswer: string | null;
    isCorrect: boolean;
  }[];
  AIScreeningQA?: {
    id: string;
    question: string;
    expectedAnswer: string;
    candidateAnswer: string | null;
    isCorrect: boolean;
  }[];
  isPremium?: boolean;
}) {
  const [value, setValue] = React.useState<string | undefined>(undefined);
  const accordionValue = `candidate-${applicationId}`;

  const maskPhone = (phone: string) => phone.replace(/\d/g, "*");

  const [showPhone, setShowPhone] = React.useState(false);
  const markAsInterested = useApplicationStore((s) => s.markAsInterested);

  const { selectedApplicationIds, toggleApplication } = useApplicationStore();

  const isOpen = value === accordionValue;

  const application = useApplicationStore(
    React.useCallback(
      (s) => s.all.find((a) => a.id === applicationId),
      [applicationId],
    ),
  );

  const attempts = application?.aiAttempts ?? 0;
  const MAX_ATTEMPTS = 2;
  const isLimitReached = attempts >= MAX_ATTEMPTS;

  return (
    <Accordion
      type="single"
      collapsible
      value={value}
      onValueChange={setValue}
      className="w-full"
    >
      <AccordionItem value={accordionValue} className="border-none">
        <Card className="overflow-hidden p-5 gap-0">
          {/* ---------------- Header ---------------- */}
          <div className="flex mb-4 justify-between w-full">
            <div className="flex flex-col gap-2 items-center">
              <div className="flex gap-2 items-center">
                {isPremium && (
                  <Checkbox
                    disabled={isLimitReached}
                    checked={selectedApplicationIds.includes(applicationId)}
                    onCheckedChange={() => {
                      if (isLimitReached) return; // ✅ HARD BLOCK
                      toggleApplication(applicationId);
                    }}
                  />
                )}
                {isPremium && (
                  <Badge variant="outline" className="text-xs">
                    Attempts: {attempts}/{MAX_ATTEMPTS}
                  </Badge>
                )}
              </div>
              <div>
                {isLimitReached && (
                  <p className="text-xs text-red-500 mt-1">
                    AI screening limit reached
                  </p>
                )}
              </div>
            </div>

            <Badge
              className={`text-white ${statusColorMap[applicationStatus]}`}
            >
              {statusLabelMap[applicationStatus]}
            </Badge>
          </div>
          <CardHeader className="flex flex-row gap-4 p-4  border rounded-t-xl bg-neutral-100">
            <div className="flex justify-between w-full">
              {/* Left */}
              <div className="flex gap-4">
                <div className="relative h-16 w-16 rounded-full bg-muted overflow-hidden">
                  <Image
                    src={candidate.photo || "/assets/dummy-user.svg"}
                    alt="Candidate avatar"
                    fill
                    className="object-cover"
                    sizes="52px"
                  />
                </div>

                <div>
                  <CardTitle>{candidate.fullName}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {candidate.highestEducation} ·{" "}
                    {candidate.educationSpecialization}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {candidate.yearsOfExperience} experience
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col justify-center">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-black/40"
                  onClick={() =>
                    setValue((prev) =>
                      prev === accordionValue ? undefined : accordionValue,
                    )
                  }
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {isOpen ? "Hide Details" : "View Details"}
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* ---------------- Content ---------------- */}
          <AccordionContent>
            <CardContent className="p-4 space-y-6 text-sm border rounded-b-xl bg-neutral-100">
              {/* -------- Personal Details -------- */}
              <section>
                <p className="font-bold text-base mb-2">Personal Information</p>
                <Separator />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Info label="Age" value={`${candidate.age} years`} />
                  {/* <Info
                    label="Date of Birth"
                    value={
                      candidate.dateOfBirth
                        ? new Date(candidate.dateOfBirth).toLocaleDateString()
                        : "—"
                    }
                  /> */}
                  <Info
                    label="Phone"
                    value={
                      <div className="flex items-center gap-2">
                        <span>
                          {showPhone
                            ? candidate.phoneNumber
                            : maskPhone(candidate.phoneNumber)}
                        </span>

                        <button
                          onClick={() => {
                            if (!showPhone && applicationStatus === "APPLIED") {
                              markAsInterested(applicationId);
                            }
                            setShowPhone((p) => !p);
                          }}
                          className="text-muted-foreground hover:text-black"
                        >
                          {showPhone ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    }
                  />

                  {/* <Info label="Email" value={candidate.email || "—"} /> */}
                </div>
              </section>

              {/* -------- Professional Details -------- */}
              <section>
                <p className="font-bold text-base mb-2">Professional Details</p>
                <Separator />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Info label="Industry" value={candidate.industry} />
                  <Info
                    label="Notice Period"
                    value={`${candidate.noticePeriod} days`}
                  />
                  <Info
                    label="Skills"
                    value={
                      candidate.skills.length > 0
                        ? candidate.skills.map((s) => s.name).join(", ")
                        : "—"
                    }
                  />
                  <Info
                    label="Languages"
                    value={
                      candidate.languages.length > 0
                        ? candidate.languages
                            .map((l) => l.languageName)
                            .join(", ")
                        : "—"
                    }
                  />
                </div>
              </section>

              {/* -------- Location -------- */}
              <section>
                <p className="font-bold text-base mb-2">Location</p>
                <Separator />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Info label="City" value={candidate.city} />
                  <Info label="State" value={candidate.state} />
                </div>
              </section>

              {/* -------- Filtering Questions -------- */}
              <section>
                <p className="font-bold text-base mb-2">Filtering Questions</p>
                <Separator />

                <div className="space-y-3 mt-4">
                  {filteringQA.length === 0 && (
                    <p className="text-muted-foreground">
                      No filtering questions
                    </p>
                  )}

                  {filteringQA.map((qa, index) => (
                    <div
                      key={qa.questionId}
                      className="p-3 rounded-md border bg-white"
                    >
                      <div className="flex justify-between">
                        <p className="font-medium">
                          Q{index + 1}. {qa.question}
                        </p>
                        <Badge
                          variant="outline"
                          className={
                            qa.isCorrect
                              ? "border-green-600 text-green-700"
                              : "border-red-600 text-red-700"
                          }
                        >
                          {qa.isCorrect ? "Correct" : "Incorrect"}
                        </Badge>
                      </div>

                      <div className="flex flex-col gap-2 mt-2">
                        <p className="text-sm mt-1">
                          Expected answer:{" "}
                          <span className="font-medium">
                            {qa.expectedAnswer}
                          </span>
                        </p>

                        <p className="text-sm">
                          Candidate Answer:{" "}
                          <span className="font-medium">
                            {qa.candidateAnswer ?? "Not answered"}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {isPremium && tab === "AIScreened" && (
                <section>
                  <p className="font-bold text-base mb-2 mt-6">
                    AI Screening Questions
                  </p>
                  <Separator />

                  <div className="space-y-3 mt-4">
                    {AIScreeningQA.length === 0 && (
                      <p className="text-muted-foreground">
                        AI screening not completed yet
                      </p>
                    )}

                    {AIScreeningQA.map((qa, index) => (
                      <div
                        key={qa.id}
                        className="p-3 rounded-md border bg-white"
                      >
                        <div className="flex justify-between">
                          <p className="font-medium">
                            Q{index + 1}. {qa.question}
                          </p>
                          <Badge
                            variant="outline"
                            className={
                              qa.isCorrect
                                ? "border-green-600 text-green-700"
                                : "border-red-600 text-red-700"
                            }
                          >
                            {qa.isCorrect ? "Fit" : "Not Fit"}
                          </Badge>
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                          <p className="text-sm">
                            Expected answer:{" "}
                            <span className="font-medium">
                              {qa.expectedAnswer}
                            </span>
                          </p>

                          <p className="text-sm">
                            Candidate answer:{" "}
                            <span className="font-medium">
                              {qa.candidateAnswer ?? "Not answered"}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </CardContent>
          </AccordionContent>
        </Card>

        <AccordionTrigger className="hidden" />
      </AccordionItem>
    </Accordion>
  );
}

/* ---------------- Helper ---------------- */

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-muted-foreground">{value}</p>
    </div>
  );
}
