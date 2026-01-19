// hooks/use-tag-logic.ts
import { KeyboardEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import { CandidateApplyFormValues } from "@/lib/validations/frontend/candidate.schema";

export function useTagLogic(
  form: UseFormReturn<CandidateApplyFormValues>,
  fieldName: "skills" | "languages"
) {
  const tags = form.watch(fieldName);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = e.currentTarget.value.trim();

      if (value && !tags.includes(value)) {
        form.setValue(fieldName, [...tags, value], { shouldValidate: true });
        e.currentTarget.value = "";
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue(
      fieldName,
      tags.filter((t) => t !== tagToRemove),
      { shouldValidate: true }
    );
  };

  return { tags, handleKeyDown, removeTag };
}
