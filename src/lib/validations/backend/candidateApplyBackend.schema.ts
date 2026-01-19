import { z } from "zod";

export const candidateBackendSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),

  email: z.string().optional(),

  phoneNumber: z
    .string()
    .min(8, "Phone number is too short")
    .max(15, "Phone number is too long"),

  gender: z.string(),

  dateOfBirth: z.coerce.date(), // converts ISO string → Date

  age: z.number().int().min(0),

  highestEducation: z.string(),

  educationSpecialization: z.string(),

  noticePeriod: z.number().int().min(0),

  photo: z.string().url().nullable().optional(),

  industry: z.string().min(1),

  yearsOfExperience: z.string().min(1),

  city: z.string(),

  state: z.string(),

  country: z.string(),
});

export type candidateBackendInput = z.infer<typeof candidateBackendSchema>;

export const candidateBackendPatchSchema = candidateBackendSchema.partial();

export type CandidateBackendPatchInput = z.infer<
  typeof candidateBackendPatchSchema
>;
