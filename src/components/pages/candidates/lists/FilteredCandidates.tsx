"use client";

import { getDisplayStatus, useApplicationStore } from "@/store/applicationStore";
import CandidateAccordionCard from "@/components/cards/CandidateCard";
import Spinner from "@/components/ui/spinner";

export default function FilteredCandidateList({
  isPremium,
}: {
  isPremium: boolean;
}) {
  const { filtered, loading } = useApplicationStore();

  if (loading) {
    return <Spinner label="Filtering candidates…" />;
  }

  if (filtered.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No filtered candidates found.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {filtered.map((application) => (
        <CandidateAccordionCard
          tab="Filtered"
          key={application.id}
          applicationId={application.id}
          applicationStatus={getDisplayStatus(application.status, "filtered")}
          candidate={application.candidate}
          filteringQA={application.filteringQA}
          isPremium={isPremium}
        />
      ))}
    </div>
  );
}
