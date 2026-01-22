"use client";

import { useApplicationStore } from "@/store/applicationStore";
import CandidateAccordionCard from "@/components/cards/CandidateCard";
import Spinner from "@/components/ui/spinner";

export default function FilteredCandidateList() {
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
          key={application.id}
          applicationId={application.id}
          applicationStatus={application.status}
          candidate={application.candidate}
        />
      ))}
    </div>
  );
}
