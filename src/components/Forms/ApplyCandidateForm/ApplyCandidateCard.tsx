"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  candidateApplySchema,
  CandidateApplyFormValues,
} from "@/lib/validations/frontend/candidate.schema";

import {
  CandidateApplyFormDefaultState,
  useCandidateApplyStore,
} from "@/store/candidateApply.store";

import { submitCandidateApplication } from "@/services/candidateApply.service";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import PersonalInfoSection from "./PersonalInfoSection";
import { ExperienceSection } from "./ExperienceSection";
import { LocationSection } from "./LocationSection";
import { TagInput } from "./TagInput";
import { FilteringAnswersSection } from "./FilteringAnswersSection";

/* ---------------- Types ---------------- */

type FilteringQuestion = {
  id: string;
  question: string;
};

type Props = {
  phoneFromUrl?: string;
  jobId: string;
  mode: "apply" | "update";
  candidateId?: string;
  initialData?: CandidateApplyFormValues;
  filteringQuestions?: FilteringQuestion[];
};

/* ---------------- Component ---------------- */

export function CandidateApplyCard({
  phoneFromUrl,
  jobId,
  mode,
  initialData,
  filteringQuestions,
}: Props) {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useCandidateApplyStore();

    const questions = filteringQuestions ?? [];


  const form = useForm<CandidateApplyFormValues>({
    resolver: zodResolver(candidateApplySchema),
    defaultValues: {
      ...CandidateApplyFormDefaultState,

      filteringAnswers: questions.map((q) => ({
        questionId: q.id,
      })),
    },
  });

  /* ---------------- Persist Draft ---------------- */

  const persistDraft = () => {
    setDraft(form.getValues());
  };

  /* ---------------- Restore Draft / Initial Data ---------------- */
  useEffect(() => {
    if (initialData) {
      form.reset({...initialData,
        filteringAnswers: questions.map((q) => ({
          questionId: q.id,
        }))
      });
      return;
    }

    if (mode === "apply" && draft) {
      form.reset(draft);
    }

    if (phoneFromUrl && !form.getValues("phoneNumber")) {
      form.setValue("phoneNumber", phoneFromUrl);
    }
  }, [draft, initialData, phoneFromUrl, mode, form]);


  /* ---------------- Submit (FIXED) ---------------- */

  const onSubmit = async (data: CandidateApplyFormValues) => {
    try {
      await submitCandidateApplication(data, jobId);

      toast.success("Application submitted!");
      clearDraft();
      router.push(`/apply/${jobId}/thank-you`);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes("already applied")
      ) {
        toast.error("You have already applied for this job");
        return;
      }

      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-[#BE4145]">
          {mode === "apply" ? "Complete Your Profile" : "Update Your Profile"}
        </CardTitle>

        <CardDescription>
          {mode === "apply"
            ? "Please provide your details to continue"
            : "You can update your profile details only once"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-10">
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log("FORM ERRORS ❌", errors);
            toast.error("Fill all the fields");
          })}
          className="space-y-10"
        >
          <PersonalInfoSection form={form} onSectionBlur={persistDraft} />

          <Separator />

          <ExperienceSection form={form} onSectionBlur={persistDraft} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TagInput
              form={form}
              name="skills"
              label="Skills"
              placeholder="Enter skills..."
            />

            <TagInput
              form={form}
              name="languages"
              label="Languages"
              placeholder="Enter languages..."
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Notice Period (Days) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                {...form.register("noticePeriod", { valueAsNumber: true })}
                onBlur={persistDraft}
              />
              {form.formState.errors.noticePeriod && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.noticePeriod.message}
                </p>
              )}
            </div>
          </div>

          <Separator />

          <LocationSection form={form} onSectionBlur={persistDraft} />

          {questions?.length > 0 && (
            <>
              <Separator />
              <FilteringAnswersSection
                form={form}
                questions={questions}
                onSectionBlur={persistDraft}
              />
            </>
          )}

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full text-lg bg-[#BE4145] text-white"
          >
            {form.formState.isSubmitting
              ? "Saving..."
              : mode === "apply"
                ? "Save and Apply"
                : "Update Details and Apply"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
