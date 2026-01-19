"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import AuthLoginForm from "@/components/Forms/AuthLoginForm";
import toast from "react-hot-toast";
import { authService } from "@/services/authKey/auth.service";

export default function Page() {
  const router = useRouter();
  const params = useParams();

  const jobId = params.jobId as string;

  

  const handleSendOtp = async (mobile: string) => {
    await authService.sendOtp(mobile);

    console.log("job ID: ", jobId)
    toast.success("OTP sent successfully");

    router.push(`/apply/${jobId}/verify?mobile=${mobile}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <Link href="/" className="mt-10 mb-8">
        <Image
          src="/assets/workezy-logo.png"
          alt="Workezy Logo"
          width={160}
          height={40}
          priority
        />
      </Link>

      <AuthLoginForm type="mobile" onSendOtp={handleSendOtp} />
    </div>
  );
}
