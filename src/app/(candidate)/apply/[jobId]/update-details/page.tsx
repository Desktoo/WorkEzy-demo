"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { CandidateApplyCard } from "@/components/Forms/ApplyCandidateForm/ApplyCandidateCard";
import { CandidateApplyFormValues } from "@/lib/validations/frontend/candidate.schema";

export default function UpdateCandidatePage() {
  const params = useParams<{ jobId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const jobId = params.jobId;
  const mobile = searchParams.get("mobile");

  const [initialData, setInitialData] =
    useState<CandidateApplyFormValues | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mobile) {
      router.replace("/");
      return;
    }

    const fetchCandidate = async () => {
      try {
        const res = await axios.post("/api/candidate/by-mobile", {
          mobile,
        });

        const c = res.data.candidate;

        const mapped: CandidateApplyFormValues = {
          photo: undefined,
          fullName: c.fullName ?? "",
          email: c.email ?? "",
          phoneNumber: mobile,
          gender: c.gender ?? "",
          dateOfBirth: c.dateOfBirth
            ? c.dateOfBirth.split("T")[0]
            : "",
          age: c.age ?? undefined,
          highestEducation: c.highestEducation ?? "",
          educationSpecialization: c.educationSpecialization ?? "",
          industry: c.industry ?? "",
          yearsOfExperience: c.yearsOfExperience ?? "",
          skills: c.skills.map((s: any) => s.name),
          languages: c.languages.map((l: any) => l.languageName),
          noticePeriod: c.noticePeriod ?? undefined,
          city: c.city ?? "",
          state: c.state ?? "",
          country: c.country ?? "India",
        };

        setInitialData(mapped);
      } catch (error: any) {
        if (error.response?.status === 403) {
          router.replace(`/apply/${jobId}/thank-you`);
        } else {
          router.replace("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [mobile, jobId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!initialData) return null;

  return (
    <div className="min-h-screen flex flex-col justify-center gap-5 bg-background py-12 px-4">
      <div className="flex items-center justify-center">
        <CandidateApplyCard
          jobId={jobId}
          mode="update"
          initialData={initialData}
        />
      </div>

      <div className="flex items-center justify-center">
        <label className="text-base text-gray-400 font-base">
          powered by <span className="font-bold text-black">Work</span>
          <span className="text-[#BE4145] font-bold">Ezy</span>
        </label>
      </div>
    </div>
  );
}
