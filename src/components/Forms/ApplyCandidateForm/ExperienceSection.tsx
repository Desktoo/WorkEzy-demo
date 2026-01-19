import { Controller, UseFormReturn } from "react-hook-form";
import { CandidateApplyFormValues } from "@/lib/validations/frontend/candidate.schema";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPERIENCE_OPTIONS } from "@/lib/constants/selectOptions";

export function ExperienceSection({
  form,
  onSectionBlur,
}: {
  form: UseFormReturn<CandidateApplyFormValues>;
  onSectionBlur: () => void;
}) {
  const {
    register,
    formState: { errors },
    control,
  } = form;

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold text-muted-foreground">
          Experience
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Industry */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            Industry <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Enter your Industry"
            {...register("industry")}
            onBlur={onSectionBlur}
          />
          {errors.industry && (
            <p className="text-xs text-red-500">{errors.industry.message}</p>
          )}
        </div>

        {/* Years of Experience */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            Years of Experience <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="yearsOfExperience"
            render={({ field: { onChange, value, onBlur } }) => (
              <Select
                value={value}
                onValueChange={(val) => {
                  onChange(val);
                  onBlur();
                  onSectionBlur();
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Years of Experience" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_OPTIONS.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.yearsOfExperience && (
            <p className="text-xs text-red-500">
              {errors.yearsOfExperience.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
