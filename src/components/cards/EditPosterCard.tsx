// components/poster/EditPosterDetailsCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useHiringPosterStore } from "@/store/hiring-poster-store/useHiringPosterStore";
import { CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toPng } from "html-to-image";
import { RefObject } from "react";

type Props = {
  jobId: string;
  posterRef: RefObject<HTMLDivElement | null>;
};

export function EditPosterDetailsCard({ jobId, posterRef }: Props) {
  const store = useHiringPosterStore();
  const router = useRouter();

  const handleAddPointer = () => {
    const current = store.requirementsText || "";
    const needsNewLine = current.length > 0 && !current.endsWith("\n");
    const bullet = `${needsNewLine ? "\n" : ""}• `;

    store.setField("requirementsText", current + bullet);
  };

  const downloadPosterImage = async () => {
    if (!posterRef.current) return;

    await document.fonts.ready;

    const dataUrl = await toPng(posterRef.current);

    const link = document.createElement("a");
    link.download = "hiring-poster.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="gap-1">
        <CardTitle className="text-lg font-bold">
          Edit Poster Details
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Changes are reflected live in the preview.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Job Title */}
        <div className="gap-1 flex flex-col">
          <label className="text-sm font-medium">Job Title</label>
          <Input
            placeholder="Engineer"
            value={store.jobTitle}
            onChange={(e) => store.setField("jobTitle", e.target.value)}
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-4">
          <div className="gap-1 flex flex-col">
            <label className="text-sm font-medium">City</label>
            <Input
              placeholder="Mumbai"
              value={store.city}
              onChange={(e) => store.setField("city", e.target.value)}
            />
          </div>

          <div className="gap-1 flex flex-col">
            <label className="text-sm font-medium">State</label>
            <Input
              placeholder="Maharashtra"
              value={store.state}
              onChange={(e) => store.setField("state", e.target.value)}
            />
          </div>
        </div>

        {/* Salary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="gap-1 flex flex-col">
            <label className="text-sm font-medium">Salary From (₹)</label>
            <Input
              placeholder="25,000"
              value={store.salaryFrom}
              onChange={(e) => store.setField("salaryFrom", e.target.value)}
            />
          </div>

          <div className="gap-1 flex flex-col">
            <label className="text-sm font-medium">Salary To (₹)</label>
            <Input
              placeholder="50,000"
              value={store.salaryTo}
              onChange={(e) => store.setField("salaryTo", e.target.value)}
            />
          </div>
        </div>

        {/* Working Days */}
        <div className="gap-1 flex flex-col">
          <label className="text-sm font-medium">
            Working Days per Week
          </label>
          <Input
            placeholder="5"
            value={store.workingDays}
            onChange={(e) => store.setField("workingDays", e.target.value)}
          />
        </div>

        {/* Requirements */}
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Requirements</label>
            <Button variant="outline" size="sm" onClick={handleAddPointer}>
              <CirclePlus className="h-4 w-4 mr-1" />
              Add Pointer
            </Button>
          </div>

          <Textarea
            className="mt-2 min-h-44 max-h-44 overflow-y-auto"
            value={store.requirementsText}
            onChange={(e) =>
              store.setField("requirementsText", e.target.value)
            }
            placeholder="Key Responsibilities"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button
            className="w-full text-white"
            onClick={downloadPosterImage}
          >
            Download Poster
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.back()}
          >
            Choose a different job
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
