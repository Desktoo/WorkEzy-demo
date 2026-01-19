// components/candidate/TagInput.tsx
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useTagLogic } from "./use-tag-logic";
import { UseFormReturn } from "react-hook-form";
import { CandidateApplyFormValues } from "@/lib/validations/frontend/candidate.schema";

type TagInputProps = {
  form: UseFormReturn<CandidateApplyFormValues>;
  name: "skills" | "languages";
  label: string;
  placeholder: string;
};

export function TagInput({ form, name, label, placeholder }: TagInputProps) {
  const { tags, handleKeyDown, removeTag } = useTagLogic(form, name);
  const error = form.formState.errors[name];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="flex flex-wrap gap-2 mb-1">
        {tags.map((tag: string) => (
          <Badge key={tag} variant="secondary" className="px-3 py-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-2 hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input placeholder={placeholder} onKeyDown={handleKeyDown} />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
