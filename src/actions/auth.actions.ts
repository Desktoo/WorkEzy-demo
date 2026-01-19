// app/verify-otp/actions.ts
"use server";

export async function verifyOtpAction(email: string, otp: string) {
  // 🔐 BACKEND LOGIC HERE
  // - Check OTP in DB / Redis
  // - Expiry validation
  // - Mark email verified

  console.log("Verify OTP", { email, otp });

  return { success: true };
}

export async function resendOtpAction(email: string) {
  // 🔐 BACKEND LOGIC HERE
  // - Generate OTP
  // - Store OTP
  // - Send email

  console.log("Resend OTP", email);

  return { success: true };
}
