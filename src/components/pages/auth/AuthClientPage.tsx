"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import AuthLoginForm from "@/components/Forms/AuthLoginForm";
import OtpVerificationForm from "@/components/Forms/OtpVerificationForm";
import { useAuthService } from "@/services/auth.service";

type Step = "email" | "otp";

export default function AuthClientPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { sendEmailOtp, verifyEmailOtp } = useAuthService();
  const router = useRouter();

  /* -----------------------------
     SEND OTP
  ----------------------------- */
  const handleSendOtp = async (value: string) => {
    try {
      setIsLoading(true);
      setEmail(value);

      await sendEmailOtp(value);

      // Swap UI, DO NOT navigate
      setStep("otp");
    } catch (error) {
      toast.error("Failed to send OTP");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  /* -----------------------------
     VERIFY OTP
  ----------------------------- */
  const handleVerifyOtp = async (otp: string) => {
    try {
      setIsLoading(true);
      const result = await verifyEmailOtp(otp);

      if (result.success) {
        toast.success("Verified!");

        // Give the browser 500ms to write the Clerk cookie before redirecting
        setTimeout(() => {
          if (result.isNewUser) {
            router.push(`/employer-registration?email=${email}`);
          } else {
            router.push(`/post-auth?`);
          }
        }, 500);
      }
    } catch {
      toast.error("Invalid or expired OTP");
    } finally {
      setIsLoading(false);
    }
  };

  /* -----------------------------
     RESEND OTP
  ----------------------------- */
  const handleResendOtp = async () => {
    if (!email) return;

    try {
      await sendEmailOtp(email);
      toast.success("OTP resent");
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      {/* Logo */}
      <Link href="/" className="mt-10 mb-8">
        <Image
          src="/assets/workezy-logo.png"
          alt="Workezy Logo"
          width={160}
          height={40}
          priority
          className="h-auto w-auto max-w-40"
        />
      </Link>

      {/* Auth Forms */}
      <div className="w-full flex justify-center">
        {step === "email" ? (
          <AuthLoginForm type="email" onSendOtp={handleSendOtp} />
        ) : (
          <OtpVerificationForm
            type="email"
            value={email}
            onVerify={handleVerifyOtp}
            onResend={handleResendOtp}
            onBack={handleBackToEmail}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Clerk captcha */}
      <div id="clerk-captcha"></div>
    </div>
  );
}
