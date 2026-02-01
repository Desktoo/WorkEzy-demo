import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CandidateApplyFormValues } from "@/lib/validations/frontend/candidate.schema";
import { FilteringQuestion } from "@/services/jobApplyMeta.service";
import { Controller, UseFormReturn } from "react-hook-form";

export function FilteringAnswersSection({
  form,
  questions,
  onSectionBlur,
}: {
  form: UseFormReturn<CandidateApplyFormValues>;
  questions: FilteringQuestion[];
  onSectionBlur: () => void;
}) {
  const { control, formState: { errors } } = form;

  if (!questions.length) return null;

  return (
    <section className="space-y-4">
      <h3 className="text-base font-bold text-muted-foreground">
        Screening Questions <span className="text-red-500">*</span>
      </h3>

      <div className="space-y-6">
        {questions.map((q, index) => (
          <div key={q.id} className="space-y-4">
            <p className="text-sm font-medium">{q.question}</p>

            <Controller
              control={control}
              // This name maps to your Zod schema
              name={`filteringAnswers.${index}.answer`}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  // Force a string value to prevent "uncontrolled" error
                  value={field.value ?? ""} 
                  onValueChange={(val) => {
                    field.onChange(val);
                    // Also update the hidden ID manually if not using defaultValues
                    form.setValue(`filteringAnswers.${index}.questionId`, q.id);
                    onSectionBlur();
                  }}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id={`yes-${index}`} />
                    <Label htmlFor={`yes-${index}`}>Yes</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id={`no-${index}`} />
                    <Label htmlFor={`no-${index}`}>No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            
            {/* Error Display */}
            {errors.filteringAnswers?.[index]?.answer && (
              <p className="text-xs text-red-500">
                {errors.filteringAnswers[index]?.answer?.message}
              </p>
            )}
            <Separator className="mt-4" />
          </div>
        ))}
      </div>
    </section>
  );
}