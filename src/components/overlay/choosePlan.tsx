"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import Image from "next/image";
import { Check, CircleX, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------- Types ---------------- */

type Plan = {
  id: string;
  name: string;
  price: number;
};

/* ---------------- Static content ---------------- */

const PLAN_CONTENT: Record<
  string,
  {
    description: string;
    features: string[];
    recommended?: boolean;
  }
> = {
  Standard: {
    description:
      "Everything you need to start posting a job and find candidates.",
    features: [
      "Job post active for 15 days",
      "Receive up to 30 relevant candidates",
      "Instant Hiring Poster",
      "AI Voice Screening (Not included)",
    ],
  },
  Premium: {
    description:
      "Supercharge your hiring with our AI-powered screening technology.",
    features: [
      "Job post active for 15 days",
      "Receive up to 30 relevant candidates",
      "Instant Hiring Poster",
      "AI Voice Screening (10 credits)",
      "Get Verified Shortlists",
    ],
    recommended: true,
  },
};

/* ---------------- Props ---------------- */

type ChoosePlanProps = {
  open: boolean;
  onSelect: (planId: string) => Promise<boolean>;
  onClose: () => void;
};

/* ---------------- Component ---------------- */

export default function ChoosePlan({
  open,
  onSelect,
  onClose,
}: ChoosePlanProps) {
  const [mounted, setMounted] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleContinue = async () => {
    if (!selected || isLoading) return;

    setIsLoading(true);

    const success = await onSelect(selected);

    if (success) {
      onClose(); 
    } else {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    if (!open) return;

    axios.get("/api/plan").then((res) => {
      const data = res.data.plans || [];
      setPlans(data);
      setSelected(data[0]?.id ?? null);
    });
  }, [open]);

  if (!mounted || !open) return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  const selectedPlan = plans.find((p) => p.id === selected);
  const selectedContent = selectedPlan ? PLAN_CONTENT[selectedPlan.name] : null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full h-[80vh] max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="flex h-full">
          {/* LEFT – Selected Plan Summary */}
          <div className="w-1/3 p-6 border-r flex flex-col">
            <div className="h-10 w-28 relative mb-2">
              <Image
                src="/assets/workezy-logo.png"
                alt="WorkEzy"
                fill
                className="object-contain"
              />
            </div>

            <p className="text-sm text-muted-foreground">Job posting payment</p>

            <div className="mt-6">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-3xl font-bold">
                ₹{selectedPlan?.price ?? "--"}
              </p>
              <p className="text-sm text-muted-foreground">/ job post</p>
            </div>

            {selectedContent && (
              <>
                <h4 className="mt-6 font-semibold text-sm">
                  What&apos;s included
                </h4>

                <ul className="mt-3 space-y-2">
                  {selectedContent.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm">
                      {f === "AI Voice Screening (Not included)" ? (
                        <X className="w-4 h-4 text-red-600 mt-0.5" />
                      ) : (
                        <Check className="w-4 h-4 text-green-600 mt-0.5" />
                      )}
                      {f}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* RIGHT – Plan Selection */}
          <div className="flex-1 p-6 bg-[#F6F7F9] flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Choose a plan</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-black"
                >
                  <CircleX />
                </button>
              </div>

              <div className="space-y-4">
                {plans.map((plan) => {
                  const planContent = PLAN_CONTENT[plan.name];

                  return (
                    <button
                      key={plan.id}
                      onClick={() => setSelected(plan.id)}
                      className={cn(
                        "relative w-full text-left bg-white border rounded-xl p-4 transition",
                        selected === plan.id
                          ? "border-[#BE4145]"
                          : "hover:border-gray-300",
                      )}
                    >
                      {/* Recommended badge */}
                      {planContent?.recommended && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#BE4145] text-white text-xs px-3 py-1 rounded-full">
                          Recommended
                        </div>
                      )}

                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{plan.name}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {planContent?.description}
                          </p>
                        </div>

                        <p className="text-lg font-bold whitespace-nowrap">
                          ₹{plan.price}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              disabled={!selected || isLoading}
              onClick={handleContinue}
              className={cn(
                "mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition",
                isLoading || !selected
                  ? "bg-[#BE4145]/70 cursor-not-allowed"
                  : "bg-[#BE4145] hover:bg-[#9c3337]",
                "text-white",
              )}
            >
              {isLoading && (
                <span className="h-4 w-4 rounded-full border-2 border-white/60 border-t-white animate-spin" />
              )}
              {isLoading ? "Processing..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    modalRoot,
  );
}
