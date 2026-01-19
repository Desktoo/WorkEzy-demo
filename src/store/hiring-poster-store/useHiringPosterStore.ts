import { create } from "zustand";

/* ---------------- State fields only ---------------- */
type HiringPosterFields = {
  jobTitle: string;
  city: string;
  state: string;
  salaryFrom: string;
  salaryTo: string;
  workingDays: string;
  requirementsText: string;
};

/* ---------------- Store type ---------------- */
type HiringPosterState = HiringPosterFields & {
  setField: <K extends keyof HiringPosterFields>(
    field: K,
    value: HiringPosterFields[K]
  ) => void;

  hydrate: (data: Partial<HiringPosterFields>) => void;
};

/* ---------------- Store ---------------- */
export const useHiringPosterStore = create<HiringPosterState>((set) => ({
  jobTitle: "",
  city: "",
  state: "",
  salaryFrom: "",
  salaryTo: "",
  workingDays: "",
  requirementsText: "",

  setField: (field, value) =>
    set(() => ({
      [field]: value,
    })),

  hydrate: (data) =>
    set(() => ({
      ...data,
    })),
}));
