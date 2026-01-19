import { z } from "zod";


const JobFilteringQuestionSchema = z.object({
  question: z
    .string()
    .min(5, "Question must be at least 5 characters"),

  expectedAnswer: z
    .string()
    .min(1, "Expected answer is required"),
});

export const JobBackendSchema = z.object({
  jobTitle: z.string().min(2, "Job title is required"),

  city: z.string().min(1, "City is required"),

  state: z.string().min(1, "State is required"),

  minExperience: z.string().min(1),

  minEducation: z.string().min(1, "Minimum education is required"),

  jobType: z.string().min(1, "Job type is required"),

  locationType: z.string().min(1, "Location type is required"),

  minSalary: z.string().min(1),

  maxSalary: z.string().min(1),

  startTime: z.coerce.date(),

  endTime: z.coerce.date(),

  daysPerWeek: z.string().min(1),

  benefits: z.array(z.string()).default([]),

  jobDescription: z.string().min(10),

  filteringQuestions: z.array(JobFilteringQuestionSchema).max(3)
,
})

export type JobBackendInput = z.infer<typeof JobBackendSchema>
