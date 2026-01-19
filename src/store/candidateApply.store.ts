import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CandidateApplyFormValues } from "@/lib/validations/frontend/candidate.schema";

type CandidateApplyDraftState = {
  draft: CandidateApplyFormValues | null;
  lastSavedAt: number | null;

  setDraft: (data: CandidateApplyFormValues) => void;
  clearDraft: () => void;
};

export const useCandidateApplyStore = create<CandidateApplyDraftState>()(
  persist(
    (set) => ({
      draft: null,
      lastSavedAt: null,

      setDraft: (data) =>
        set({
          draft: data,
          lastSavedAt: Date.now(),
        }),

      clearDraft: () =>
        set({
          draft: null,
          lastSavedAt: null,
        }),
    }),
    {
      name: "candidate-apply-draft",
    }
  )
);

export const CandidateApplyFormDefaultState: CandidateApplyFormValues = {
  photo: undefined,
  fullName: "",
  email: "",
  phoneNumber: "",
  gender: "",
  dateOfBirth: "",
  age: undefined,
  highestEducation: "",
  educationSpecialization: "",
  industry: "",
  yearsOfExperience: "",
  skills: [],
  languages: [],
  noticePeriod: undefined,
  city: "",
  state: "",
  country: "India",
  filteringAnswers: [],
};
