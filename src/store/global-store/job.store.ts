import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useJobStore = create<>()persist()