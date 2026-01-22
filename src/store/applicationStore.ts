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

export type Application = {
  id: string;
  status: ApplicationStatus;
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
};

/* ---------------- Store ---------------- */

type ApplicationStore = {
  all: Application[];
  filtered: Application[];
  aiScreened: Application[];

  selectedCandidateIds: string[];

  loading: boolean;
  error: string | null;

  fetchApplications: (jobId: string) => Promise<void>;
  markAsInterested: (applicationId: string) => Promise<void>;

  toggleCandidateSelection: (candidateId: string) => void;
  clearSelectedCandidates: () => void;
};

export const useApplicationStore = create<ApplicationStore>((set) => ({
  all: [],
  filtered: [],
  aiScreened: [],
  selectedCandidateIds: [],

  loading: false,
  error: null,

  /* ---------------- Fetch Applications ---------------- */

  fetchApplications: async (jobId) => {
    try {
      set({ loading: true, error: null });

      const { data } = await axios.get(
        `/api/job/${jobId}/candidates`
      );

      const normalized: Application[] = data.map((app: any) => {
        const total = app.filteringStats.totalQuestions;
        const right = app.filteringStats.right;

        const percentage =
          total === 0 ? 0 : Math.round((right / total) * 100);

        return {
          id: app.id,
          status: app.status,
          candidate: app.candidate,
          filteringStats: {
            totalQuestions: total,
            correctAnswers: right,
            percentage,
            isFiltered: app.filteringStats.isFiltered,
          },
        };
      });

      /* ---------------- STRICT SEPARATION ---------------- */

      set({
        all: normalized,

        filtered: normalized.filter(
          (a) =>
            a.filteringStats.totalQuestions > 0 &&
            a.filteringStats.isFiltered &&
            a.status !== "AI_SCREENED" &&
            a.status !== "AI_FIT" &&
            a.status !== "AI_NOT_FIT"
        ),

        aiScreened: normalized.filter(
          (a) =>
            a.status === "AI_SCREENED" ||
            a.status === "AI_FIT" ||
            a.status === "AI_NOT_FIT"
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
          : app
      );

      return {
        all: updatedAll,
        filtered: updatedAll.filter(
          (a) =>
            a.filteringStats.isFiltered &&
            !["AI_SCREENED", "AI_FIT", "AI_NOT_FIT"].includes(a.status)
        ),
        aiScreened: updatedAll.filter((a) =>
          ["AI_SCREENED", "AI_FIT", "AI_NOT_FIT"].includes(a.status)
        ),
      };
    });

    try {
      await axios.patch(
        `/api/applications/${applicationId}/mark-interested`
      );
    } catch (error) {
      console.error("Failed to update application status:", error);
    }
  },

  /* ---------------- Selection ---------------- */

  toggleCandidateSelection: (candidateId) =>
    set((state) => ({
      selectedCandidateIds: state.selectedCandidateIds.includes(candidateId)
        ? state.selectedCandidateIds.filter((id) => id !== candidateId)
        : [...state.selectedCandidateIds, candidateId],
    })),

  clearSelectedCandidates: () =>
    set({ selectedCandidateIds: [] }),
}));
