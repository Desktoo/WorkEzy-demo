"use client";

import { useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type OtpType = "email" | "mobile";

type Props = {
  type: OtpType;
  value: string; // email or mobile
  onVerify: (otp: string) => void;
  onResend: () => void;
  isLoading: boolean
};

export default function OtpVerificationForm({
  type,
  value,
  onVerify,
  onResend,
  isLoading
}: Props) {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const isEmail = type === "email";

  return (
    <div className="w-full max-w-md rounded-xl border bg-white shadow-lg p-8">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-center mb-2">
        Verify Your {isEmail ? "Email" : "Mobile Number"}
      </h2>

      {/* Subtitle */}
      <p className="text-sm text-muted-foreground text-center mb-6">
        We have sent an OTP to{" "}
        <span className="font-medium text-foreground">{value}</span>
      </p>

      {/* OTP Input */}
      <div className="flex justify-center mb-6">
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Verify Button */}
      <Button
        className="w-full text-white transition-all active:scale-95"
        style={{ backgroundColor: "#BE4145" }}
        disabled={otp.length !== 6}
        onClick={() => onVerify(otp)}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifying OTP...
          </>
        ) : (
          "Verify OTP"
        )}
      </Button>

      {/* Resend */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        {timer > 0 ? (
          <>Didn&apos;t receive the code? Resend in {timer}s</>
        ) : (
          <button
            onClick={() => {
              setOtp("");
              setTimer(30);
              onResend();
            }}
            className="font-medium"
            style={{ color: "#BE4145" }}
          >
            Didn&apos;t receive the code? Resend
          </button>
        )}
      </div>
    </div>
  );
}
