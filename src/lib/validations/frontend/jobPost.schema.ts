import { z } from "zod";

/* ---------------- Filtering Question ---------------- */

export const filteringQuestionSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  expectedAnswer: z.enum(["yes", "no"]),
});

/* ---------------- Main Job Schema ---------------- */

export const postJobSchema = z.object({
  jobTitle: z.string().min(2, "Job title is required"),

  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),

  minExperience: z.string().min(1, "Experience is required"),
  minEducation: z.string().min(1, "Education is required"),

  jobType: z.string().min(1, "Job type is required"),
  locationType: z.string().min(1, "Location type is required"),

  minSalary: z.string().min(1, "Salary Range is required"),
  maxSalary: z.string().min(1, "Salary Range is required"),

  startTime: z.string().min(1, "Start time is required"), // e.g. "09:00 AM"
  endTime: z.string().min(1, "End time is required"), // e.g. "05:00 PM"

  daysPerWeek: z.string().min(1, "Days per Week is required"),

  benefits: z.array(z.string()).optional(),

  jobDescription: z
    .string()
    .min(20, "Job description must be at least 20 characters"),

  /* -------- Filtering Questions (MAX 3) -------- */
  filteringQuestions: z
    .array(filteringQuestionSchema)
    .max(3, "You can add a maximum of 3 filtering questions")
    .optional(),
});

/* ---------------- Types ---------------- */

export type PostJobFormValues = z.infer<typeof postJobSchema>;
