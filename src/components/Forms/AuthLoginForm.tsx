"use client";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { User, Phone, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type AuthLoginFormProps = {
  type: "email" | "mobile";
  onSendOtp: (value: string) => Promise<void> | void;
};

export default function AuthLoginForm({
  type,
  onSendOtp,
}: AuthLoginFormProps) {
  const [value, setValue] = useState("");
  const [isLoading, setIsloading] = useState(false)
  const isEmail = type === "email";

  const handleSendOtp = async () => {
    if (!value.trim()) {
      toast.error(
        isEmail ? "Email address required" : "Mobile number required"
      );
      return;
    }

    // Basic mobile validation (UI-level only)
    if (!isEmail && !/^\d{10}$/.test(value)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }

    try {
      setIsloading(true)
      await onSendOtp(value);
    } catch (err) {
      toast.error("Failed to send OTP");
      console.error(err);
    } finally {
       setIsloading(false)
    }
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-xl border bg-white shadow-lg p-8">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-center mb-2">
        {isEmail ? "Employer Login" : "Candidate Login"}
      </h2>

      {/* Subtitle */}
      <p className="text-sm text-muted-foreground text-center mb-6">
        {isEmail
          ? "We will send an OTP to confirm your email"
          : "We will send an OTP to verify your mobile number"}
      </p>

      {/* Input */}
      <div className="space-y-2 flex flex-col">
        <label className="text-sm font-medium">
          {isEmail ? "Email Address" : "Mobile Number"}
        </label>

        <div className="relative">
          {isEmail ? (
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          ) : (
            <Phone
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          )}

          <Input
            type={isEmail ? "email" : "tel"}
            placeholder={
              isEmail ? "you@company.com" : "Enter 10-digit mobile number"
            }
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="pl-10 focus-visible:ring-[#BE4145]"
          />
        </div>
      </div>

      {/* Button */}
      <Button
        onClick={handleSendOtp}
        className="w-full mt-6 text-white transition-all hover:scale-105 active:scale-95"
        style={{ backgroundColor: "#BE4145" }}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending OTP...
          </>
        ) : (
          "Send OTP"
        )}
      </Button>
    </div>
  );
}
