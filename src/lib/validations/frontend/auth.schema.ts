import { z } from "zod";

/* ----------------------------------------
   Email input (Login / Send OTP)
---------------------------------------- */
export const emailLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
});

export type EmailLoginInput = z.infer<typeof emailLoginSchema>;

/* ----------------------------------------
   OTP Verification
---------------------------------------- */
export const otpVerificationSchema = z.object({
  email: z
    .string()
    .email("Invalid email address"),

  otp: z
    .string()
    .length(4, "OTP must be 4 digits")
    .regex(/^\d{4}$/, "OTP must contain only numbers"),
});

export type OtpVerificationInput = z.infer<typeof otpVerificationSchema>;
