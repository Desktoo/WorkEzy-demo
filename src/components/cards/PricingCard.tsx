"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { initiateRazorpayPayment } from "@/services/payment.service";
import { useState } from "react";
import Spinner from "../ui/spinner";

type Feature = {
  label: string;
  available: boolean;
  highlight?: boolean;
};

type PricingCardProps = {
  planId: string;
  title: string;
  price: number;
  durationText: string;
  description: string;
  features: Feature[];
  primary?: boolean;
  recommended?: boolean;
};

export default function PricingCard({
  planId,
  title,
  price,
  durationText,
  description,
  features,
  primary,
  recommended,
}: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true); // 🔹 start loader
      await initiateRazorpayPayment(planId);
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsLoading(false); // 🔹 stop loader
    }
  };

  return (
    <Card
      className={cn(
        "relative w-full max-w-md rounded-xl border bg-white shadow-sm",
        primary && "border-[#BE4145]"
      )}
    >
      {/* Recommended badge */}
      {recommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#BE4145] px-4 py-1 text-sm font-semibold text-white">
          Recommended
        </div>
      )}

      <CardHeader className="text-center space-y-2 pt-10">
        <CardTitle
          className={cn(
            "text-2xl font-bold",
            primary && "text-[#BE4145]"
          )}
        >
          {title}
        </CardTitle>

        <div className="flex justify-center items-end gap-2">
          <span className="text-5xl font-bold">₹{price}</span>
          <span className="text-muted-foreground text-lg">
            / {durationText}
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-8 pt-6">
        <p className="text-center text-muted-foreground mb-6">
          {description}
        </p>

        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              {feature.available ? (
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <X className="h-5 w-5 text-red-500 mt-0.5" />
              )}
              <span
                className={cn(
                  "text-sm",
                  feature.highlight && "font-semibold text-black"
                )}
              >
                {feature.label}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="px-8 pt-6 pb-8">
        <Button
          onClick={handlePayment}
          disabled={isLoading}
          className={cn(
            "w-full text-base font-semibold transition-all flex items-center justify-center gap-2",
            primary
              ? "bg-[#BE4145] hover:bg-[#9c3337] text-white"
              : "bg-muted hover:bg-muted/80 text-black",
            isLoading && "cursor-not-allowed opacity-80"
          )}
        >
          {isLoading && (
            <Loader2 className="h-5 w-5 animate-spin" />
          )}
          {isLoading ? ` Processing...` : "Post a Job"}
        </Button>
      </CardFooter>
    </Card>
  );
}
