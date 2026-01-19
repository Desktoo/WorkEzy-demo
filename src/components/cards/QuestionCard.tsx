"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Controller, UseFormReturn } from "react-hook-form";
import { PostJobFormValues } from "@/lib/validations/frontend/jobPost.schema";

type QuestionCardProps = {
  index: number;
  onDelete: () => void;
  form: UseFormReturn<PostJobFormValues>;
  onSectionBlur: () => void;
};

export default function QuestionCard({
  index,
  onDelete,
  form,
  onSectionBlur,
}: QuestionCardProps) {
  const {
    register,
    formState: { errors },
    control,
  } = form;

  return (
    <Card className=" w-full">
      {/* Delete button */}

      <CardContent className="space-y-6">
        {/* Question */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-base font-semibold">
              Question {index + 1}
            </Label>
            <Button
              type="button"
              onClick={onDelete}
              className="  text-[#BE4145] hover:text-red-600 bg-transparent hover:bg-gray-100"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
          <Input
            placeholder="e.g. Do you have a valid driver's license?"
            {...register(`filteringQuestions.${index}.question`)}
            onBlur={onSectionBlur}
          />
          {errors.filteringQuestions?.[index]?.question && (
            <p className="text-xs text-red-500">
              {errors.filteringQuestions[index]?.question?.message}
            </p>
          )}
        </div>

        {/* Ideal Answer */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Ideal Answer</Label>

          <Controller
            control={control}
            name={`filteringQuestions.${index}.expectedAnswer`}
            render={({ field: { value, onChange } }) => (
              <RadioGroup
                className="flex gap-6"
                value={value}
                onValueChange={(val) => {
                  onChange(val);
                  onSectionBlur();
                }}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id={`yes-${index}`} />
                  <Label htmlFor={`yes-${index}`}>Yes</Label>
                </div>

                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id={`no-${index}`} />
                  <Label htmlFor={`no-${index}`}>No</Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.filteringQuestions?.[index]?.expectedAnswer && (
            <p className="text-xs text-red-500">
              {errors.filteringQuestions[index]?.expectedAnswer?.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
