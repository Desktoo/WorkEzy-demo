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
}: {
  applicationId: string;
  applicationStatus: keyof typeof statusLabelMap;
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
}) {
  const [value, setValue] = React.useState<string | undefined>(undefined);
  const accordionValue = `candidate-${applicationId}`;

  const maskPhone = (phone: string) => phone.replace(/\d/g, "*");

  const [showPhone, setShowPhone] = React.useState(false);
  const markAsInterested = useApplicationStore((s) => s.markAsInterested);

  const { selectedCandidateIds, toggleCandidateSelection } =
    useApplicationStore();

  // For Later Logic of sending candidateIds for processing 
  // const selectedIds = useApplicationStore((s) => s.selectedCandidateIds);

  return (
    <Accordion
      type="single"
      collapsible
      value={value}
      onValueChange={setValue}
      className="w-full"
    >
      <AccordionItem value={accordionValue} className="border-none">
        <Card className="overflow-hidden p-5 ">
          {/* ---------------- Header ---------------- */}
          <div className="flex justify-between w-full">
            <Checkbox
              checked={selectedCandidateIds.includes(candidate.id)}
              onCheckedChange={() => toggleCandidateSelection(candidate.id)}
            />

            <Badge
              className={`text-white ${statusColorMap[applicationStatus]}`}
            >
              {statusLabelMap[applicationStatus]}
            </Badge>
          </div>
          <CardHeader className="flex flex-row gap-4 p-4  border rounded-xl bg-neutral-100">
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
                  View Details
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* ---------------- Content ---------------- */}
          <AccordionContent>
            <CardContent className="p-4 space-y-6 text-sm border rounded-xl bg-neutral-100">
              {/* -------- Personal Details -------- */}
              <section>
                <p className="font-bold text-base mb-2">Personal Information</p>
                <Separator />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Info label="Age" value={`${candidate.age} years`} />
                  <Info
                    label="Date of Birth"
                    value={
                      candidate.dateOfBirth
                        ? new Date(candidate.dateOfBirth).toLocaleDateString()
                        : "—"
                    }
                  />
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

                  <Info label="Email" value={candidate.email || "—"} />
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
