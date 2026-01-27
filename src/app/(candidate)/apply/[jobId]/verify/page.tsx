"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useState } from "react";
import OtpVerificationForm from "@/components/Forms/OtpVerificationForm";
import toast from "react-hot-toast";
import { authService } from "@/services/authKey/auth.service";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();

  const jobId = params.jobId as string;
  const mobile = searchParams.get("mobile")!;

  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (otp: string) => {
    try {
      setIsLoading(true);

      await authService.verifyOtp(mobile, otp);

      toast.success("OTP verified successfully");

      router.push(`/apply/${jobId}/complete-profile?mobile=${mobile}`);
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authService.resendOtp(mobile);
      toast.success("OTP resent");
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Link href="/" className="mb-8">
        <Image
          src="/assets/workezy-logo.png"
          alt="Workezy Logo"
          width={160}
          height={40}
          priority
        />
      </Link>

      <OtpVerificationForm
        type="mobile"
        value={mobile}
        onVerify={handleVerify}
        onResend={handleResend}
        onBack={handleBack}
        isLoading={isLoading}
      />
    </div>
  );
}
