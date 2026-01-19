import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios, { AxiosError } from "axios";

export type Employer = {
  id: string;
  email: string;
  fullName: string;
  companyName: string;
  designation: string;
  industry: string;
  numOfEmployees: string;
  country: string;
  state: string;
  city: string;
  gender: string;
  socialMedia: string;
  companyLogo: string;
  panCard: string;
  gstCertificate: string;
};

type EmployerStore = {
  employer: Employer | null;
  loading: boolean;
  error: string | null;

  fetchEmployer: () => Promise<void>;
  clearEmployer: () => void;
};

export const useEmployerStore = create<EmployerStore>()(
  persist(
    (set) => ({
      employer: null,
      loading: false,
      error: null,

      fetchEmployer: async () => {

        try {
          set({ loading: true, error: null });

          const res = await axios.get("/api/employer")

          set({
            employer: res.data.employer,
            loading: false,
          });
        } catch (err) {

          const error = err as AxiosError<{ message: string }>

          set({
            employer: null,
            loading: false,
            error:
              error?.response?.data?.message ||
              "Failed to fetch employer",
          });
        }
      },

      clearEmployer: () => {
        set({ employer: null, error: null });
      },
    }),
    {
      name: "employer-store", // localStorage key
    }
  )
);
