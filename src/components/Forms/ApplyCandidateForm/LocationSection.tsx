// components/candidate/sections/LocationSection.tsx
import { Controller, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INDIA_STATES } from "@/lib/constants/selectOptions";
import { CandidateApplyFormValues } from "@/lib/validations/frontend/candidate.schema";

export function LocationSection({
  form,
  onSectionBlur,
}: {
  form: UseFormReturn<CandidateApplyFormValues>;
  onSectionBlur: () => void;
}) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <section className="space-y-4">
      <h3 className="text-base font-bold text-muted-foreground">Location</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* City */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            City <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Mumbai"
            {...register("city")}
            onBlur={onSectionBlur}
          />
          {errors.city && (
            <p className="text-xs text-red-500">{errors.city.message}</p>
          )}
        </div>

        {/* State */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            State <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="state"
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
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {INDIA_STATES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.state && (
            <p className="text-xs text-red-500">{errors.state.message}</p>
          )}
        </div>

        {/* Country */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Country</label>
          <Input value="India" disabled {...register("country")} />
        </div>
      </div>
    </section>
  );
}
