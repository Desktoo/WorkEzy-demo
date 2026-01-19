import { z } from "zod";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

/* ---------------- Photo Schema---------------- */

const photoSchema = z
  .instanceof(File, { message: "Photo is required" })
  .optional()
  .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
    message: "Photo size must be less than 1MB",
  })
  .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: "Only JPG, PNG, or WEBP images are allowed",
  });



const filteringAnswerSchema = z.object({
  questionId: z.string(),
  answer: z.enum(["yes", "no"]),
});  

/* ---------------- Candidate Apply Schema ---------------- */

export const candidateApplySchema = z.object({
  photo: photoSchema,

  fullName: z.string().min(4, "Full name is required"),

  email: z.string().optional(),

  phoneNumber: z.string().optional(),

  gender: z.string().min(1, "Gender is required"),

  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .optional(),

  age: z
    .number()
    .min(18, "You must be 18 or older to apply")
    .optional()
    .refine((d) => d !== undefined, { message: "Age is required" }),

  highestEducation: z.string().min(1, "Education is required"),

  educationSpecialization: z
    .string()
    .min(1, "Specialization is required")
    .optional(),

  skills: z.array(z.string().min(1)).min(1, "At least one skill is required"),

  languages: z
    .array(z.string().min(1))
    .min(1, "At least one language is required"),

  noticePeriod: z
    .number()
    .min(1, "Notice period is required")
    .max(60, "Maximum 60 days allowed")
    .optional()
    .refine((d) => d !== undefined, { message: "Notice Period is required" }),

  industry: z.string().min(1, "Industry is Required"),

  yearsOfExperience: z.string().min(1, "Experience is Required"),

  city: z.string().min(1, "City is required"),

  state: z.string().min(1, "State is required"),

  country: z.string().min(1, "Country is required"),

  filteringAnswers: z
    .array(filteringAnswerSchema)
    .optional(),
});

/* ---------------- Types ---------------- */

export type CandidateApplyFormValues = z.infer<typeof candidateApplySchema>;
