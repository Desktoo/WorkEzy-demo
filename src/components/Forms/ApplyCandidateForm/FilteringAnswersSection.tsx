"use client";

import { Controller, UseFormReturn } from "react-hook-form";
import { CandidateApplyFormValues } from "@/lib/validations/frontend/candidate.schema";
import { Separator } from "@/components/ui/separator";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type FilteringQuestion = {
  id: string;
  question: string;
};

export function FilteringAnswersSection({
  form,
  questions,
  onSectionBlur,
}: {
  form: UseFormReturn<CandidateApplyFormValues>;
  questions: FilteringQuestion[];
  onSectionBlur: () => void;
}) {
  const { control } = form;

  if (!questions.length) return null;

  return (
    <section className="space-y-4">
      <h3 className="text-base font-bold text-muted-foreground">
        Screening Questions
      </h3>

      <div className="space-y-6">
        {questions.map((q, index) => (
          <Controller
            key={q.id}
            control={control}
            name={`filteringAnswers.${index}`}
            render={({ field }) => (
              <div className="space-y-2">
                <input type="hidden" value={q.id} />

                <p className="text-sm font-medium">{q.question}</p>

                <RadioGroup
                  value={field.value?.answer}
                  onValueChange={(val) => {
                    field.onChange({
                      questionId: q.id,
                      answer: val,
                    });
                    onSectionBlur();
                  }}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id={`${q.id}-yes`} />
                    <Label htmlFor={`${q.id}-yes`}>Yes</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id={`${q.id}-no`} />
                    <Label htmlFor={`${q.id}-no`}>No</Label>
                  </div>
                </RadioGroup>

                <Separator />
              </div>
            )}
          />
        ))}
      </div>
    </section>
  );
}
