import { EmployerRegistrationFormValues } from "@/lib/validations/frontend/employer.schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type EmployerRegistrationDraftState = {
  draft: EmployerRegistrationFormValues | null;
  lastSavedAt: number | null;

  setDraft: (data: EmployerRegistrationFormValues) => void;
  clearDraft: () => void;
};

export const useEmployerRegistrationStore =
  create<EmployerRegistrationDraftState>()(
    persist(
      (set) => ({
        draft: null,
        lastSavedAt: null,

        setDraft: (data) => {
          set({
            draft: data,
            lastSavedAt: Date.now(),
          });
        },

        clearDraft: () => {
          set({
            draft: null,
            lastSavedAt: null,
          });
        },
      }),
      {
        name: "employer-registration-draft",
      }
    )
  );

export const EmployerRegistrationFormDefaultState: EmployerRegistrationFormValues =
  {
    fullName: "",
    email: "",
    gender: "",
    designation: "",
    companyLogo: undefined,
    companyName: "",
    industry: "",
    numOfEmployees: "",
    socialMedia: "",
    city: "",
    state: "",
    country: "India",
    panCard: undefined,
    gstCertificate: undefined,
  };
