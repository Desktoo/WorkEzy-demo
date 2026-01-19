'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  ArrowLeft,
  Users,
  FileText,
  Bot,
  Check,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

type CandidateStatus = 'Applied' | 'Interested' | 'Rejected' | 'AI Screened';

type CandidateProfile = {
  id: string;
  fullName: string;
  highestEducation: string;
  degree?: string;
  totalExperience: number;
  status: CandidateStatus;
};

type Job = {
  id: string;
  jobTitle: string;
};

/* -------------------------------------------------------------------------- */
/*                              DUMMY DATA                                    */
/* -------------------------------------------------------------------------- */

const dummyJob: Job = {
  id: 'job_1',
  jobTitle: 'Frontend React Developer',
};

const dummyCandidates: CandidateProfile[] = [
  {
    id: 'c1',
    fullName: 'Aman Sharma',
    highestEducation: 'Graduate',
    degree: 'B.Tech CSE',
    totalExperience: 2,
    status: 'Applied',
  },
  {
    id: 'c2',
    fullName: 'Riya Verma',
    highestEducation: 'Post Graduate',
    degree: 'MCA',
    totalExperience: 4,
    status: 'AI Screened',
  },
  {
    id: 'c3',
    fullName: 'Mohit Jain',
    highestEducation: 'Diploma',
    degree: 'Computer Engineering',
    totalExperience: 1,
    status: 'Rejected',
  },
  {
    id: 'c4',
    fullName: 'Sneha Kapoor',
    highestEducation: 'Graduate',
    degree: 'B.Sc IT',
    totalExperience: 3,
    status: 'AI Screened',
  },
];

/* -------------------------------------------------------------------------- */
/*                               UI HELPERS                                   */
/* -------------------------------------------------------------------------- */

const statusColors: Record<CandidateStatus, string> = {
  Applied: 'bg-blue-500',
  Interested: 'bg-green-600',
  Rejected: 'bg-red-600',
  'AI Screened': 'bg-purple-600',
};

/* -------------------------------------------------------------------------- */
/*                           UI COMPONENTS                                    */
/* -------------------------------------------------------------------------- */

const PhotoDisplay = ({ name }: { name: string }) => (
  <Avatar className="h-14 w-14">
    <AvatarFallback className="text-lg">
      {name.charAt(0)}
    </AvatarFallback>
  </Avatar>
);

const CandidateCard = ({
  candidate,
  jobId,
  isSelected,
  onToggle,
  showFitBadge,
  isFit,
  hideSelection,
  hideStatusBadge,
}: {
  candidate: CandidateProfile;
  jobId: string;
  isSelected: boolean;
  onToggle: (id: string, value: boolean) => void;
  showFitBadge?: boolean;
  isFit?: boolean;
  hideSelection?: boolean;
  hideStatusBadge?: boolean;
}) => {
  const router = useRouter();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row gap-4 bg-muted/30 p-4">
        {!hideSelection && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={(v) => onToggle(candidate.id, !!v)}
          />
        )}

        <div className="flex justify-between w-full">
          <div className="flex gap-4">
            <PhotoDisplay name={candidate.fullName} />
            <div>
              <CardTitle>{candidate.fullName}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {candidate.highestEducation} ({candidate.degree})
              </p>
              <p className="text-sm text-muted-foreground">
                {candidate.totalExperience} years experience
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              {showFitBadge && (
                isFit ? (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Fit
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <X className="h-3 w-3 mr-1" />
                    Not a Fit
                  </Badge>
                )
              )}

              {!hideStatusBadge && (
                <Badge
                  className={cn(
                    'text-white',
                    statusColors[candidate.status]
                  )}
                >
                  {candidate.status}
                </Badge>
              )}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                router.push(
                  `/dashboard/jobs/${jobId}/candidates/${candidate.id}`
                )
              }
            >
              <FileText className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

const CandidateList = ({
  candidates,
  jobId,
  selected,
  onToggle,
  showFitBadge,
  fitIds,
  hideSelection,
  hideStatusBadge,
}: {
  candidates: CandidateProfile[];
  jobId: string;
  selected: string[];
  onToggle: (id: string, value: boolean) => void;
  showFitBadge?: boolean;
  fitIds?: string[];
  hideSelection?: boolean;
  hideStatusBadge?: boolean;
}) => {
  if (candidates.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <Users className="h-12 w-12 mx-auto mb-4" />
        No candidates found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {candidates.map((c) => (
        <CandidateCard
          key={c.id}
          candidate={c}
          jobId={jobId}
          isSelected={selected.includes(c.id)}
          onToggle={onToggle}
          showFitBadge={showFitBadge}
          isFit={fitIds?.includes(c.id)}
          hideSelection={hideSelection}
          hideStatusBadge={hideStatusBadge}
        />
      ))}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               PAGE                                         */
/* -------------------------------------------------------------------------- */

export default function CandidatesPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const aiScreened = dummyCandidates.filter(
    (c) => c.status === 'AI Screened'
  );

  const fitCandidates = aiScreened.slice(0, 1);
  const notFitCandidates = aiScreened.slice(1);

  const handleToggle = (id: string, value: boolean) => {
    setSelected((prev) =>
      value ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push('/dashboard')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Jobs
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div>
              <CardTitle>
                Candidates for {dummyJob.jobTitle}
              </CardTitle>
              <CardDescription>
                Found {dummyCandidates.length} candidates
              </CardDescription>
            </div>

            <div className="flex gap-4">
              <Alert className="p-3">
                <Bot className="h-4 w-4" />
                <AlertTitle>AI Credits</AlertTitle>
                <AlertDescription>7 / 10 Available</AlertDescription>
              </Alert>

              <Button disabled={selected.length === 0}>
                <Bot className="h-4 w-4 mr-2" />
                Start AI Screening ({selected.length})
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="all">
                All ({dummyCandidates.length})
              </TabsTrigger>
              <TabsTrigger value="filtered">
                Filtered (2)
              </TabsTrigger>
              <TabsTrigger value="ai">
                AI Screened ({aiScreened.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <CandidateList
                candidates={dummyCandidates}
                jobId={dummyJob.id}
                selected={selected}
                onToggle={handleToggle}
              />
            </TabsContent>

            <TabsContent value="filtered" className="mt-6">
              <CandidateList
                candidates={dummyCandidates.slice(0, 2)}
                jobId={dummyJob.id}
                selected={selected}
                onToggle={handleToggle}
              />
            </TabsContent>

            <TabsContent value="ai" className="mt-6 space-y-6">
              <CandidateList
                candidates={fitCandidates}
                jobId={dummyJob.id}
                selected={selected}
                onToggle={handleToggle}
                showFitBadge
                fitIds={fitCandidates.map((c) => c.id)}
                hideSelection
                hideStatusBadge
              />

              {notFitCandidates.length > 0 && (
                <>
                  <Separator />
                  <CandidateList
                    candidates={notFitCandidates}
                    jobId={dummyJob.id}
                    selected={selected}
                    onToggle={handleToggle}
                    showFitBadge
                    fitIds={fitCandidates.map((c) => c.id)}
                    hideSelection
                    hideStatusBadge
                  />
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
