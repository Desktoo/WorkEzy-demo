"use client";

import { forwardRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useHiringPosterStore } from "@/store/hiring-poster-store/useHiringPosterStore";
import { useEmployerStore } from "@/store/global-store/employer.store";

const PosterPreviewCard = forwardRef<HTMLDivElement>((_, ref) => {
  const store = useHiringPosterStore();
  const { employer } = useEmployerStore()

  return (
    <div ref={ref}>
      <Card className="relative w-full max-w-lg overflow-hidden border-none shadow-xl bg-white min-h-150 flex flex-col justify-between">
        {/* Decorative circles */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#BE4145]/5 rounded-full z-0" />
        <div className="absolute -bottom-20 -right-10 w-64 h-64 bg-[#BE4145]/5 rounded-full z-0" />

        <CardContent className="relative z-10 p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">We are Hiring!</h2>
              <h1 className="text-6xl font-black text-[#BE4145]">
                {store.jobTitle}
              </h1>
            </div>

            <div className="w-24 h-20 relative border rounded-lg">
              <Image
                src={ employer?.companyLogo || "/assets/workezy-logo.png"}
                alt="logo"
                fill
                className="object-contain p-2"
              />
            </div>
          </div>

          <ul className="space-y-4 pt-4">
            <li className="flex gap-1 font-medium">
              <ChevronRight className="text-[#BE4145]" />
              Location: {store.city}, {store.state}
            </li>
            <li className="flex gap-1 font-medium">
              <ChevronRight className="text-[#BE4145]" />
              Working Days: {store.workingDays} days/week
            </li>
            <li className="flex gap-1 font-medium">
              <ChevronRight className="text-[#BE4145]" />
              Salary: ₹{store.salaryFrom} – ₹{store.salaryTo}/month
            </li>
          </ul>

          <div className="pt-4 whitespace-pre-line">
            <h3 className="text-xl font-bold mb-2">Requirements</h3>
            {store.requirementsText}
          </div>
        </CardContent>

        <CardFooter className="p-8 flex justify-between">
          <Button className="bg-[#BE4145] text-white px-8 py-6 rounded-3xl text-lg font-bold">
            APPLY NOW
          </Button>

          <p className="text-gray-400 text-sm">
            Powered by <span className="font-bold">work<span className="text-[#BE4145]">ezy</span></span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
});

PosterPreviewCard.displayName = "PosterPreviewCard";
export default PosterPreviewCard;
