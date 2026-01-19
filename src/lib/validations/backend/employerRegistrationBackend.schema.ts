import { z } from "zod";

export const employerRegistrationBackendSchema = z.object({
  fullName: z
    .string()
    .min(2)
    .max(100),

  email: z
    .string()
    .email(),

  gender: z
    .string()
    .min(1),

  designation: z
    .string()
    .min(2)
    .max(100),

  companyName: z
    .string()
    .min(2)
    .max(150),

  industry: z
    .string()
    .min(2)
    .max(100),

  numOfEmployees: z
    .string()
    .min(1),

  socialMedia: z
    .string()
    .url()
    .optional()
    .or(z.literal("")),

  city: z
    .string()
    .min(2)
    .max(100),

  state: z
    .string()
    .min(1),

  country: z.literal("India"),

  companyLogo: z
    .string()
    .optional()
    .nullable(),

  panCard: z
    .string()
    .optional()
    .nullable(),

  gstCertificate: z
    .string()
    .optional()
    .nullable(),
});

export type EmployerRegistrationBackendInput = z.infer<
  typeof employerRegistrationBackendSchema
>;
