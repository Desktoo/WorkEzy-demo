import { create } from "zustand";
import axios from "axios";

/* ---------------- Types ---------------- */

export type ApplicationStatus =
  | "APPLIED"
  | "INTERESTED"
  | "AI_SCREENED"
  | "AI_FIT"
  | "AI_NOT_FIT";

export type FilteringStats = {
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  isFiltered: boolean;
};

export type FilteringQA = {
  questionId: string;
  question: string;
  expectedAnswer: string;
  candidateAnswer: string | null;
  isCorrect: boolean;
};

export type AIScreeningQA = {
  id: string;
  question: string;
  expectedAnswer: string;
  candidateAnswer: string | null;
  isCorrect: boolean;
};

export type Application = {
  id: string;
  status: ApplicationStatus;
  aiAttempts: number
  candidate: {
    id: string;
    fullName: string;
    email?: string;
    phoneNumber: string;
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
  filteringStats: FilteringStats;
  filteringQA: FilteringQA[];
  aiScreeningQA: AIScreeningQA[];
};

/* ---------------- Store ---------------- */

type ApplicationStore = {
  all: Application[];
  filtered: Application[];
  aiScreened: Application[];

  selectedApplicationIds: string[];

  loading: boolean;
  error: string | null;

  fetchApplications: (jobId: string) => Promise<void>;
  markAsInterested: (applicationId: string) => Promise<void>;

  toggleApplication: (applicationId: string) => void;
  clearSelectedCandidates: () => void;


};

export const useApplicationStore = create<ApplicationStore>((set) => ({
  all: [],
  filtered: [],
  aiScreened: [],
  selectedApplicationIds: [],

  loading: false,
  error: null,

  /* ---------------- Fetch Applications ---------------- */

  fetchApplications: async (jobId) => {
    try {
      set({ loading: true, error: null });

      const { data } = await axios.get(`/api/job/${jobId}/candidates`);

      const normalized: Application[] = data.map((app: any) => {
        const total = app.filteringStats.totalQuestions;
        const right = app.filteringStats.right;

        const percentage =
          total === 0 ? 0 : Math.round((right / total) * 100);

        return {
          id: app.id,
          status: app.status,
          aiAttempts: app.aiAttempts ?? 0,
          candidate: app.candidate,
          filteringStats: {
            totalQuestions: total,
            correctAnswers: right,
            percentage,
            isFiltered: app.filteringStats.isFiltered,
          },
          filteringQA: app.filteringQA,
          aiScreeningQA: app.aiQA ?? [],
        };
      });

      /* ---------------- STRICT SEPARATION ---------------- */

      set({
        all: normalized,

        filtered: normalized.filter(
          (a) =>
            a.filteringStats.totalQuestions > 0 &&
            a.filteringStats.isFiltered,
        ),

        aiScreened: normalized.filter(
          (a) =>
            a.status === "AI_SCREENED" ||
            a.status === "AI_FIT" ||
            a.status === "AI_NOT_FIT",
        ),
      });
    } catch (error) {
      console.error("Fetch candidates failed:", error);
      set({ error: "Unable to load candidates" });
    } finally {
      set({ loading: false });
    }
  },

  /* ---------------- Mark as Interested ---------------- */

  markAsInterested: async (applicationId) => {
    set((state) => {
      const updatedAll = state.all.map((app) =>
        app.id === applicationId && app.status === "APPLIED"
          ? {
              ...app,
              status: "INTERESTED" as ApplicationStatus,
            }
          : app,
      );

      return {
        all: updatedAll,
        filtered: updatedAll.filter((a) => a.filteringStats.isFiltered),
        aiScreened: updatedAll.filter((a) =>
          ["AI_SCREENED", "AI_FIT", "AI_NOT_FIT"].includes(a.status),
        ),
      };
    });

    try {
      await axios.patch(
        `/api/applications/${applicationId}/mark-interested`,
      );
    } catch (error) {
      console.error("Failed to update application status:", error);
    }
  },

  /* ---------------- Selection ---------------- */

  toggleApplication: (applicationId) =>
    set((state) => ({
      selectedApplicationIds: state.selectedApplicationIds.includes(applicationId)
        ? state.selectedApplicationIds.filter((id) => id !== applicationId)
        : [...state.selectedApplicationIds, applicationId],
    })),

  clearSelectedCandidates: () => set({ selectedApplicationIds: [] }),


}));

export function getDisplayStatus(
  realStatus: ApplicationStatus,
  tab: "all" | "filtered" | "ai",
): ApplicationStatus {
  if (tab !== "ai" && realStatus.startsWith("AI_")) {
    return "AI_SCREENED";
  }
  return realStatus;
}
