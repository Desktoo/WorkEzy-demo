"use client";

import { getDisplayStatus, useApplicationStore } from "@/store/applicationStore";
import CandidateAccordionCard from "@/components/cards/CandidateCard";
import Spinner from "@/components/ui/spinner";

export default function AllCandidateList({ isPremium }: { isPremium: boolean }) {
  const { all, loading } = useApplicationStore();

  if (loading) {
    return <Spinner label="Loading candidates…" />;
  }

  if (all.length === 0) {
    return <p className="text-sm text-muted-foreground">No candidates yet.</p>;
  }

  return (
    <div className="space-y-4">
      {all.map((application) => (
        <CandidateAccordionCard
          key={application.id}
          applicationId={application.id}
          applicationStatus={getDisplayStatus(application.status, "all")}
          candidate={application.candidate}
          filteringQA={application.filteringQA}
          isPremium={isPremium}
        />
      ))}
    </div>
  );
}
