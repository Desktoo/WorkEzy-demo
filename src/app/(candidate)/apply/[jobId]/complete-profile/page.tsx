"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";

import { CandidateApplyCard } from "@/components/Forms/ApplyCandidateForm/ApplyCandidateCard";
import {
  fetchJobApplyMeta,
  FilteringQuestion,
} from "@/services/jobApplyMeta.service";
import axios from "axios";
import { CandidateApplyFormValues } from "@/lib/validations/frontend/candidate.schema";

export default function CandidateApplyPage() {
  const searchParams = useSearchParams();
  const params = useParams();

  const phoneNumberFromUrl = searchParams.get("mobile");
  const jobId = params.jobId as string;

  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [filteringQuestions, setFilteringQuestions] = useState<
    FilteringQuestion[]
  >([]);

  const [existingCandidate, setExistingCandidate] = useState<any | null>(null);
  const [isPrefillLoading, setIsPrefillLoading] = useState(true);

  function mapCandidateToForm(candidate: any): CandidateApplyFormValues {
    return {
      photo: candidate.photo ?? "",
      fullName: candidate.fullName ?? "",
      email: candidate.email ?? "",
      phoneNumber: candidate.phoneNumber ?? "",
      gender: candidate.gender ?? "",
      dateOfBirth: candidate.dateOfBirth
        ? new Date(candidate.dateOfBirth).toISOString().slice(0, 10)
        : "",
      age: candidate.age ?? undefined,
      highestEducation: candidate.highestEducation ?? "",
      educationSpecialization: candidate.educationSpecialization ?? "",
      industry: candidate.industry ?? "",
      yearsOfExperience: candidate.yearsOfExperience ?? "",
      skills: candidate.skills?.map((s: any) => s.name) ?? [],
      languages: candidate.languages?.map((l: any) => l.languageName) ?? [],
      noticePeriod: candidate.noticePeriod ?? undefined,
      city: candidate.city ?? "",
      state: candidate.state ?? "",
      country: candidate.country ?? "India",
    };
  }

  useEffect(() => {
    async function loadApplyMeta() {
      try {
        const data = await fetchJobApplyMeta(jobId);
        setCompanyLogo(data.companyLogo);
        setFilteringQuestions(data.filteringQuestions ?? []);
      } catch (error) {
        console.error("Failed to load apply metadata", error);
      }
    }

    loadApplyMeta();
  }, [jobId]);

  useEffect(() => {
    if (!phoneNumberFromUrl) {
      setIsPrefillLoading(false);
      return;
    }

    const fetchExistingCandidate = async () => {
      try {
        const { data } = await axios.get("/api/candidate/by-mobile", {
          params: { mobile: phoneNumberFromUrl },
        });

        if (data.exists) {
          setExistingCandidate(data.candidate);
        }
      } catch (error) {
        console.error("Failed to fetch candidate by mobile", error);
      } finally {
        setIsPrefillLoading(false);
      }
    };

    fetchExistingCandidate();
  }, [phoneNumberFromUrl]);

  return (
    <div className="min-h-screen flex flex-col justify-center gap-5 bg-background py-12 px-4">
      {/* -------- Company Logo -------- */}
      <div className="flex justify-center items-center">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white border">
          <Image
            src={companyLogo ?? "/placeholder-logo.png"}
            alt="Company logo"
            fill
            sizes="128px"
            className="object-contain p-4"
          />
        </div>
      </div>

      {/* -------- Apply Form -------- */}
      <div className="flex items-center justify-center">
        <CandidateApplyCard
          phoneFromUrl={phoneNumberFromUrl ?? undefined}
          jobId={jobId}
          filteringQuestions={filteringQuestions}
          mode={existingCandidate ? "update" : "apply"}
          initialData={
            existingCandidate
              ? mapCandidateToForm(existingCandidate)
              : undefined
          }
        />
      </div>

      {/* -------- Footer -------- */}
      <div className="flex items-center justify-center">
        <label className="text-base text-gray-400 font-base">
          powered by <span className="font-bold text-black">Work</span>
          <span className="text-[#BE4145] font-bold">Ezy</span>
        </label>
      </div>
    </div>
  );
}
