"use client";

import { Button } from "@/components/ui/button";
import BasicDetailSection from "./BasicDetailSection";
import BenefitsSection from "./BenefitsSection";
import JobDescriptionSection from "./JobDescriptionSection";
import FilteringQuestionSection from "./FilteringQuestionSection";
import { useForm } from "react-hook-form";
import {
  PostJobFormValues,
  postJobSchema,
} from "@/lib/validations/frontend/jobPost.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PostJobFormDefaultState,
  usePostJobStore,
} from "@/store/job/postJob.store";
import { useEffect, useRef, useState } from "react";
import JobTypeAndScheduleSection from "./JobTypeAndScheduleSection";
import toast from "react-hot-toast";
import { submitPostJob, updateJob } from "@/services/job.service";
import { Card } from "@/components/ui/card";
import axios from "axios";
import ChoosePlan from "@/components/overlay/choosePlan";
import { initiateRazorpayPayment } from "@/services/payment.service";
import { useRouter } from "next/navigation";

type PostJobFormProps = {
  mode?: "post" | "edit";
  jobId?: string;
  initialData?: PostJobFormValues;
};

export default function PostJobForm({
  mode = "post",
  jobId,
  initialData,
}: PostJobFormProps) {
  const { draft, setDraft, clearDraft } = usePostJobStore();

  const form = useForm<PostJobFormValues>({
    resolver: zodResolver(postJobSchema),
    defaultValues: PostJobFormDefaultState,
  });

  const [showPlans, setShowPlans] = useState(false);
  const router = useRouter();
  const pendingSubmitRef = useRef<PostJobFormValues | null>(null);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset(initialData);
      return;
    }

    if (draft) {
      form.reset(draft);
    }
  }, []);

  const handleSelect = async (planId: string) => {
    try {
      const success = await initiateRazorpayPayment(planId);

      if (!success) return false;

      setShowPlans(false);

      if (pendingSubmitRef.current) {
        await submitPostJob(pendingSubmitRef.current);
        clearDraft();
        toast.success("Job posted successfully!");
        router.push("/dashboard");
        pendingSubmitRef.current = null;
      }

      return true;
    } catch {
      return false;
    }
  };

  const onSubmit = async (data: PostJobFormValues) => {
    try {
      if (mode === "edit" && jobId) {
        await updateJob(jobId, data);
        toast.success("Job updated successfully!");
        router.push("/dashboard");
        return;
      }

      const res = await axios.get("/api/job/can-post");

      if (!res.data.canPost) {
        pendingSubmitRef.current = data;
        setShowPlans(true);
        return;
      }
      await submitPostJob(data);
      toast.success("Job Posted successfully!");
      clearDraft();
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  return (
    <>
      <Card className="max-w-5xl rounded-xl bg-white shadow-lg p-6">
        <h2 className="text-3xl font-semibold mb-2">
          {mode === "edit" ? "Edit Job" : "Post a New Job"}
        </h2>
        <p className="text-muted-foreground text-sm mb-8">
          {mode === "edit"
            ? "Update the details of your job posting"
            : "Fill in the details below to post a job opening"}
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit, () => {
            toast.error("Please fill all required fields");
          })}
          className="space-y-10"
        >
          <BasicDetailSection
            form={form}
            onSectionBlur={() => setDraft(form.getValues())}
          />
          <JobTypeAndScheduleSection
            form={form}
            onSectionBlur={() => setDraft(form.getValues())}
          />
          <BenefitsSection
            form={form}
            onSectionBlur={() => setDraft(form.getValues())}
          />
          <JobDescriptionSection
            form={form}
            onSectionBlur={() => setDraft(form.getValues())}
          />
          <FilteringQuestionSection
            form={form}
            onSectionBlur={() => setDraft(form.getValues())}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full text-lg bg-[#BE4145]"
          >
            {form.formState.isSubmitting
              ? "Saving..."
              : mode === "edit"
                ? "Update Job"
                : "Post Job"}
          </Button>
        </form>
      </Card>

      {showPlans && (
        <ChoosePlan
          open={showPlans}
          onClose={() => setShowPlans(false)}
          onSelect={handleSelect}
        />
      )}
    </>
  );
}
