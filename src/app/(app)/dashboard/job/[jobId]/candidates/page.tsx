"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Bot } from "lucide-react";
import AllCandidateList from "@/components/pages/candidates/lists/AllCandidates";
import { useApplicationStore } from "@/store/applicationStore";
import { useEffect, useState } from "react";
import FilteredCandidateList from "@/components/pages/candidates/lists/FilteredCandidates";
import AiScreenedCandidateList from "@/components/pages/candidates/lists/AiScreenedCandidates";
import { useJobStore } from "@/store/job/job.store";
import StartAiScreeningDialog from "@/components/dialogBox/aiScreenQues";

export default function CandidatesPage() {
  const router = useRouter();
  const { jobId } = useParams<{ jobId: string }>();

  const { all, filtered, aiScreened, fetchApplications } =
    useApplicationStore();

  const { job, fetchJob, getAvailableCredits } = useJobStore();

  const [openAiDialog, setOpenAiDialog] = useState(false);
  
  const availableCredits = job ? getAvailableCredits() : 0;

  const hasCredits = availableCredits > 0;
  const selectedCount = useApplicationStore(
    (s) => s.selectedCandidateIds.length,
  );

  useEffect(() => {
    if (jobId) {
      fetchApplications(jobId);
      fetchJob(jobId);
    }

    console.log("this is job: ", job);
    console.log(" this is ai credits :", availableCredits);
  }, [jobId, fetchApplications, fetchJob]);

  return (
    <div className="space-y-6 p-6">
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard")}
        className="hover:text-gray-600"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Jobs
      </Button>

      <Card className="max-h-screen">
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-0.5">
              <CardTitle className="text-xl">
                Candidates for {job?.jobTitle} Job
              </CardTitle>
              <CardDescription className="text-sm">
                {all.length === 0
                  ? "No Candidates found"
                  : `Found ${all.length} candidate${all.length > 1 ? "s" : ""}`}
              </CardDescription>
            </div>

            <div className="flex gap-4">
              <Button className="p-3 bg-transparent text-black/60 border hover:bg-transparent">
                <Bot className="h-4 w-4 mr-2" />
                AI Credits: {availableCredits} / {job?.totalCredits ?? 0}
              </Button>

              <Button
                className="flex gap-2"
                disabled={!hasCredits || selectedCount === 0}
                onClick={() => setOpenAiDialog(true)}
              >
                <Bot className="h-4 w-4" />
                Start AI Screening
              </Button>

              <StartAiScreeningDialog
                jobId={jobId}
                open={openAiDialog}
                onClose={() => setOpenAiDialog(false)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="h-full overflow-y-auto">
          <Tabs defaultValue="all" className="p-5 flex items-center">
            <TabsList className="grid grid-cols-3 gap-5 w-2xl">
              <TabsTrigger value="all">All ({all.length})</TabsTrigger>
              <TabsTrigger value="filtered">
                Filtered ({filtered.length})
              </TabsTrigger>
              <TabsTrigger value="ai">
                AI Screened({aiScreened.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6 w-full ">
              <AllCandidateList />
            </TabsContent>

            <TabsContent value="filtered" className="mt-6 w-full">
              <FilteredCandidateList />
            </TabsContent>

            <TabsContent value="ai" className="mt-6 w-full">
              <AiScreenedCandidateList />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
