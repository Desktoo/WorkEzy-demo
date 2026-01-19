import { z } from "zod";

/**
 * Constants
 */
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const DOCUMENT_TYPES = [".pdf", ".doc", ".docx"];
/**
 * Reusable file validator
 */
/**
 * Reusable file validator
 */
const imageFileSchema = z
  .instanceof(File)
  .optional()
  .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
    message: "Image size must be less than 1MB",
  })
  .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: "Only JPG, PNG, or WEBP images are allowed",
  });

export const documentFileSchema = z
  .instanceof(File)
  .optional()
  .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
    message: "File size must be less than 1MB",
  })
  .refine(
    (file) => {
      if (!file) return true; // Skip if no file is provided
      const fileName = file.name.toLowerCase();
      return DOCUMENT_TYPES.some((ext) => fileName.endsWith(ext));
    },
    { message: "Only PDF, DOC, or DOCX files are allowed" }
  );

/**
 * Employer Registration Schema
 */
export const employerRegistrationSchema = z.object({
  // -------- Personal Details --------
  fullName: z
    .string()
    .min(2, "Full name is required")
    .max(100, "Full name is too long"),

  email: z.string().email("Invalid email address"),

  gender: z.string().min(1, "Gender is required"),

  designation: z
    .string()
    .min(2, "Designation is required")
    .max(100, "Designation is too long"),

  // -------- Company Details --------
  companyLogo: imageFileSchema,

  companyName: z
    .string()
    .min(2, "Company name is required")
    .max(150, "Company name is too long"),

  industry: z
    .string()
    .min(2, "Industry is required")
    .max(100, "Industry name is too long"),

  numOfEmployees: z.string().min(1, "Company size is required"),

  socialMedia: z.string().url("Invalid URL").optional().or(z.literal("")),

  city: z.string().min(2, "City is required").max(100, "City name is too long"),

  state: z.string().min(1, "State is required"),

  country: z.literal("India"),

  // -------- Verification Documents --------
  panCard: documentFileSchema,

  gstCertificate: documentFileSchema,
});

/**
 * Type for React Hook Form
 */
export type EmployerRegistrationFormValues = z.infer<
  typeof employerRegistrationSchema
>;
