import { PostJobFormValues } from "@/lib/validations/frontend/jobPost.schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type PostJobDraftState = {
  draft: PostJobFormValues | null;
  lastSavedAt: number | null;

  setDraft: (data: PostJobFormValues) => void;
  clearDraft: () => void;
};

export const usePostJobStore = create<PostJobDraftState>()(
  persist(
    (set) => ({
      draft: null,
      lastSavedAt: null,

      setDraft: (data) =>
        set({
          draft: data,
          lastSavedAt: Date.now(),
        }),

      clearDraft: () => {
        set({
          draft: null,
          lastSavedAt: null,
        });
      },
    }),
    {
      name: "post-job-draft",
    }
  )
);

export const PostJobFormDefaultState: PostJobFormValues = {
  jobTitle: "",
  city: "",
  state: "",
  minExperience: "",
  minEducation: "",
  jobType: "",
  locationType: "",
  minSalary: "",
  maxSalary: "",
  startTime: "",
  endTime: "",
  daysPerWeek: "",
  benefits: [],
  jobDescription: "",
  filteringQuestions: [{ question: "", expectedAnswer: "yes" }],
};
