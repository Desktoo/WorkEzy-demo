"use client";

import { getDisplayStatus, useApplicationStore } from "@/store/applicationStore";
import CandidateAccordionCard from "@/components/cards/CandidateCard";
import Spinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams } from "next/navigation";

export default function AiScreenedCandidateList({ isPremium }: { isPremium: boolean }) {
  const { jobId } = useParams<{ jobId: string }>();
  const { aiScreened, loading, fetchApplications } =
    useApplicationStore();

  if (loading) {
    return <Spinner label="Loading AI screened candidates…" />;
  }

  if (aiScreened.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No AI screened candidates yet.
      </p>
    );
  }

  /* --------------------------------
     Evaluate AI (per application)
  --------------------------------- */
  const evaluateAi = async (applicationId: string) => {
    try {
      await axios.post(
        `/api/applications/${applicationId}/ai-evaluate`
      );

      // Refresh list after evaluation
      await fetchApplications(jobId);
    } catch (error) {
      console.error("AI evaluation failed:", error);
    }
  };

  return (
    <div className="space-y-4">
      {aiScreened.map((application) => (
        <div key={application.id} className="space-y-2">
          {/* Evaluate button ONLY for AI_SCREENED */}
          {application.status === "AI_SCREENED" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => evaluateAi(application.id)}
            >
              Evaluate AI
            </Button>
          )}

          <CandidateAccordionCard
            tab="AIScreened"
            isPremium={isPremium}
            applicationId={application.id}
            applicationStatus={getDisplayStatus(application.status, "ai")}
            candidate={application.candidate}
            filteringQA={application.filteringQA}
            AIScreeningQA={application.aiScreeningQA}
          />
        </div>
      ))}
    </div>
  );
}
