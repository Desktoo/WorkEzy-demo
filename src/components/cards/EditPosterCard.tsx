// components/poster/EditPosterDetailsCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PosterPdfDocument } from "../poster/PosterPDFDocs";
import { useHiringPosterStore } from "@/store/hiring-poster-store/useHiringPosterStore";
import { CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";

export function EditPosterDetailsCard({ jobId }: { jobId: string }) {
  const store = useHiringPosterStore();

  const router = useRouter()

  const handleAddPointer = () => {
    const current = store.requirementsText || "";

    const needsNewLine =
      current.length > 0 && !current.endsWith("\n");

    const bullet = `${needsNewLine ? "\n" : ""}• `;

    store.setField(
      "requirementsText",
      current + bullet
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="gap-1">
        <CardTitle className="text-lg font-bold">Edit Poster Details</CardTitle>
        <p className="text-sm text-muted-foreground">
          Changes are reflected live in the preview.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="gap-1 flex flex-col">
          <label className="text-sm font-medium">Job Title</label>
          <Input
            placeholder="Engineer"
            value={store.jobTitle}
            onChange={(e) => store.setField("jobTitle", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="gap-1 flex flex-col">
            <label className="text-sm font-medium">City</label>
            <Input
              placeholder="Mumbai"
              value={store.city}
              onChange={(e) => store.setField("city", e.target.value)}
            />{" "}
          </div>
          <div className="gap-1 flex flex-col">
            <label className="text-sm font-medium">State</label>
            <Input
              placeholder="Maharashtra"
              value={store.state}
              onChange={(e) => store.setField("state", e.target.value)}
            />{" "}
          </div>
        </div>

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
            />{" "}
          </div>
        </div>

        <div className="gap-1 flex flex-col">
          <label className="text-sm font-medium">Working Days per Week</label>
          <Input
            placeholder="5"
            value={store.workingDays}
            onChange={(e) => store.setField("workingDays", e.target.value)}
          />
        </div>

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
            onChange={(e) => store.setField("requirementsText", e.target.value)}
            placeholder="Key Responsibilities"
            // value={`Key Responsibilities:\n▶ Manage incoming and outgoing inventory`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <PDFDownloadLink
            document={
              <PosterPdfDocument
                jobId={jobId}
                jobTitle={store.jobTitle}
                city={store.city}
                state={store.state}
                salaryFrom={store.salaryFrom}
                salaryTo={store.salaryTo}
                workingDays={store.workingDays}
                requirements={store.requirementsText}
              />
            }
            fileName="hiring-poster.pdf"
          >
            {({ loading }) => (
              <Button className="w-full text-white">
                {loading ? "Downloading PDF" : "Download Poster"}
              </Button>
            )}
          </PDFDownloadLink>

          <Button variant="outline" className="w-full" onClick={() => router.back()}>
            Choose a different job
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
