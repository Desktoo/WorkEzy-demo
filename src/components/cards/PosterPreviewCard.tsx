"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Banknote, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useHiringPosterStore } from "@/store/hiring-poster-store/useHiringPosterStore";

export default function PosterPreviewCard() {

  const store = useHiringPosterStore()

  return (
    <Card className="relative w-full max-w-lg overflow-hidden border-none shadow-xl bg-white min-h-150 flex flex-col justify-between">
      
      {/* --- DECORATIVE CIRCLES --- */}
      {/* Top Left Circle */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#BE4145]/5 rounded-full z-0" />
      
      {/* Bottom Right Circle */}
      <div className="absolute -bottom-20 -right-10 w-64 h-64 bg-[#BE4145]/5 rounded-full z-0" />

      <CardContent className="relative z-10 p-8 space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-gray-900">We are Hiring!</h2>
            <h1 className="text-6xl font-black text-[#BE4145] tracking-tight">
              {store.jobTitle}
            </h1>
          </div>
          
          {/* Image Placeholder Div */}
          <div className="w-24 h-20 bg-gray-100 rounded-lg overflow-hidden border relative">
             <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-400">
                <Image 
                  alt="logo"
                  src={"/assets/workezy-logo.png"}
                  fill
                  className="object-contain p-2"
                />
             </div>
             {/* Replace with <Image src="..." fill className="object-cover" /> */}
          </div>
        </div>

        {/* Job Details List */}
        <ul className="space-y-4 pt-4">
          <li className="flex items-center gap-1 text-gray-800 font-medium">
            <ChevronRight className="w-5 h-5 text-[#BE4145] fill-[#BE4145]" />
            <span>Location: {store.city}, {store.state}</span>
          </li>
          <li className="flex items-center gap-1 text-gray-800 font-medium">
            <ChevronRight className="w-5 h-5 text-[#BE4145] fill-[#BE4145]" />
            <span>Working Days: {store.workingDays} days/week</span>
          </li>
          <li className="flex items-center gap-1 text-gray-800 font-medium">
            <ChevronRight className="w-5 h-5 text-[#BE4145] fill-[#BE4145]" />
            <span>Salary: ₹{store.salaryFrom} – ₹{store.salaryTo}/month</span>
          </li>
        </ul>

        {/* Requirements Section */}
        <div className="space-y-3 pt-4">
          <h3 className="text-xl font-bold text-gray-900">Requirements</h3>
          
          <div className="flex items-start gap-2 text-gray-700 whitespace-pre-line">
             {/* <span className="text-[#BE4145] mt-1">▶</span> */}
             <p>{store.requirementsText}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="relative z-10 p-8 flex flex-col items-start gap-8">
        {/* Apply Button */}
        <Button 
          className="bg-[#BE4145] hover:bg-[#a3363a] text-white px-10 py-7 rounded-3xl text-xl font-bold shadow-lg shadow-[#BE4145]/30 transition-transform hover:scale-105"
        >
          APPLY NOW
        </Button>

        {/* Footer Branding */}
        <div className="w-full flex justify-end">
          <p className="text-gray-400 text-sm">
            Powered by{" "}
            <span className="font-bold text-gray-900 text-lg">
              work<span className="text-[#BE4145]">ezy</span>
            </span>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}