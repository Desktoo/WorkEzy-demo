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
import { useEffect } from "react";
import JobTypeAndScheduleSection from "./JobTypeAndScheduleSection";
import toast from "react-hot-toast";
import { submitPostJob, updateJob } from "@/services/job.service";

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

  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset(initialData);
      return;
    }

    if (draft) {
      form.reset(draft);
    }
  }, []);

  const onSubmit = async (data: PostJobFormValues) => {
    try {
      if (mode === "edit" && jobId) {
        await updateJob(jobId, data);
        toast.success("Job updated successfully!");
      } else {
        console.log(
          "this is the final paylaod before going to the server: ",
          data
        );

        await submitPostJob(data);
        toast.success("Job posted successfully!");
      }

      clearDraft();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  return (
    <div className="w-full max-w-5xl rounded-xl border bg-white shadow-lg p-6">
      <h2 className="text-3xl font-semibold mb-2">
        {mode === "edit" ? "Edit Job" : "Post a New Job"}
      </h2>
      <p className="text-muted-foreground text-sm mb-8">
        {mode === "edit"
          ? "Update the details of your job posting"
          : "Fill in the details below to post a job opening"}
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
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
    </div>
  );
}
