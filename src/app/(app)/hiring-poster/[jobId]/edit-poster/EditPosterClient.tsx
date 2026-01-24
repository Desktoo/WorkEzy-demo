"use client";

import { useEffect, useRef } from "react";
import { useHiringPosterStore } from "@/store/hiring-poster-store/useHiringPosterStore";
import { EditPosterDetailsCard } from "@/components/cards/EditPosterCard";
import PosterPreviewCard from "@/components/cards/PosterPreviewCard";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

type Props = {
  jobId: string,
  initialData: {
    jobTitle: string;
    city: string;
    state: string;
    salaryFrom: string;
    salaryTo: string;
    workingDays: string;
    requirementsText: string;
  };
};

export default function EditPosterClient({ initialData, jobId }: Props) {
  const store = useHiringPosterStore();

  useEffect(() => {
    store.hydrate(initialData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const posterRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <label className="text-xl font-semibold">
          Edit Hiring Poster
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 p-4 gap-8">
        {/* Preview */}
        <div className="lg:col-span-2">
          <Card className="p-4">
            <CardTitle className="flex flex-col gap-0.5">
              <label className="text-xl font-bold">
                Poster Preview
              </label>
              <label className="text-sm font-medium text-gray-500">
                This is a live preview of your poster
              </label>
            </CardTitle>
            <CardContent className="flex justify-center">
              <PosterPreviewCard ref={posterRef} />
            </CardContent>
          </Card>
        </div>

        {/* Editor */}
        <EditPosterDetailsCard jobId={jobId} posterRef={posterRef}/>
      </div>
    </div>
  );
}
