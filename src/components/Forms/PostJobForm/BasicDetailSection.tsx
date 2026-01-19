import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EXPERIENCE_OPTIONS,
  MIN_EDUCATION_REQUIRED,
} from "@/lib/constants/selectOptions";
import { PostJobFormValues } from "@/lib/validations/frontend/jobPost.schema";
import { Controller, UseFormReturn } from "react-hook-form";

export default function BasicDetailSection({
  form,
  onSectionBlur,
}: {
  form: UseFormReturn<PostJobFormValues>;
  onSectionBlur: () => void;
}) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <section className="mb-8 flex flex-col gap-4">
      <h3 className="text-lg font-bold mb-2 border-b-2 pb-4 border-gray-200">
        Basic Details
      </h3>

      {/* Job Title */}
      <div className="space-y-2 flex flex-col">
        <label className="text-sm font-medium">
          Job Title<span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="e.g. Senior Engineer"
          {...register("jobTitle")}
          onBlur={onSectionBlur}
        />
        {errors.jobTitle && (
          <p className="text-xs text-red-500">{errors.jobTitle.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* City */}
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium">
            City <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g. Mumbai"
            {...register("city")}
            onBlur={onSectionBlur}
          />
          {errors.city && (
            <p className="text-xs text-red-500">{errors.city.message}</p>
          )}
        </div>

        {/* State */}
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium">
            State <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g. Maharashtra"
            {...register("state")}
            onBlur={onSectionBlur}
          />
          {errors.state && (
            <p className="text-xs text-red-500">{errors.state.message}</p>
          )}
        </div>

        {/* Min Experience Level */}
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium">
            Minimum Experience Required <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="minExperience"
            render={({ field: { value, onChange, onBlur } }) => (
              <Select
                value={value}
                onValueChange={(val) => {
                  onChange(val);
                  onBlur();
                  onSectionBlur();
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.minExperience && (
            <p className="text-xs text-red-500">
              {errors.minExperience.message}
            </p>
          )}
        </div>

        {/* Min Education Required */}
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium">
            Minimum Education Required <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="minEducation"
            render={({ field: { value, onChange, onBlur } }) => (
              <Select
                value={value}
                onValueChange={(val) => {
                  onChange(val);
                  onBlur();
                  onSectionBlur();
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Education level" />
                </SelectTrigger>
                <SelectContent>
                  {MIN_EDUCATION_REQUIRED.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.minEducation && (
            <p className="text-xs text-red-500">
              {errors.minEducation.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
