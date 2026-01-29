import { create } from "zustand";
import axios from "axios";

type Job = {
  id: string;
  jobTitle: string;
  planType: "Standard" | "Premium"
  totalCredits: number; 
  creditsUsed: number;
};

type JobStore = {
  job: Job | null;
  loading: boolean;

  fetchJob: (jobId: string) => Promise<void>;
  getAvailableCredits: () => number;
  hasAiCredits: () => boolean;
};

export const useJobStore = create<JobStore>((set, get) => ({
  job: null,
  loading: false,

  fetchJob: async (jobId) => {
    try {
      set({ loading: true });
      const { data } = await axios.get(`/api/job/${jobId}/ai-screening`);
      set({ job: data });
    } catch (err) {
      console.error("Failed to fetch job", err);
    } finally {
      set({ loading: false });
    }
  },

  /* --------------------------------
     Derived helpers (JOB owns credits)
  --------------------------------- */
  getAvailableCredits: () => {
    const job = get().job;
    if (!job) return 0;
    return Math.max(0, job.totalCredits - job.creditsUsed);
  },

  hasAiCredits: () => {
    return get().getAvailableCredits() > 0;
  },
}));
