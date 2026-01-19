"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CandidateApplyFormValues } from "@/lib/validations/frontend/candidate.schema";

type IndustryExperienceCardProps = {
  index: number;
  form: UseFormReturn<CandidateApplyFormValues>;
  onRemove?: () => void;
  onSectionBlur: () => void;
};

export function IndustryExperienceCard({
  index,
  form,
  onRemove,
  onSectionBlur,
}: IndustryExperienceCardProps) {
  const {
    register,
    formState: { errors },
  } = form;

  const error = errors.experiences?.[index];

  return (
    <Card
      className={`w-full transition-shadow hover:shadow-sm ${
        error ? "border-destructive/50" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* Industry Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Industry <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g. IT, Manufacturing"
              {...register(`experiences.${index}.industry`)}
              className={
                error ? "border-destructive focus-visible:ring-destructive" : ""
              }
              onBlur={onSectionBlur}
            />
          </div>

          {/* Years of Experience Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Years of Experience <span className="text-red-500">*</span>
            </label>

            <div className="flex items-center gap-2 w-full">
              <Input
                type="number"
                min="0"
                max="60"
                {...register(`experiences.${index}.years`, {
                  valueAsNumber: true,
                })}
                onBlur={onSectionBlur}
                placeholder="0"
                className={`w-full md:w-32 ${
                  error
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
              />

              {onRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="ml-auto text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                  onClick={onRemove}
                  title="Remove experience"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
