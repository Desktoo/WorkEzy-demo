import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GENDERS } from "@/lib/constants/selectOptions";
import { EmployerRegistrationFormValues } from "@/lib/validations/frontend/employer.schema";
import { Controller, UseFormReturn } from "react-hook-form";

export default function PersonalInfoSection({
  form,
  onSectionBlur,
}: {
  form: UseFormReturn<EmployerRegistrationFormValues>;
  onSectionBlur: () => void;
}) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <section className="mb-8">
      <h3 className="text-lg font-bold mb-6 border-b-2 pb-4 border-gray-200">
        Personal Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g. Anjali Mehta"
            {...register("fullName")}
            onBlur={onSectionBlur}
          />
          {errors.fullName && (
            <p className="text-xs text-red-500">
              {errors.fullName.message as string}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <Input {...register("email")} disabled />
          {errors.email && (
            <p className="text-xs text-red-500">
              {errors.email.message as string}
            </p>
          )}
        </div>

        {/* Gender */}
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium">
            Gender <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => (
              <Select value={value ?? undefined} onValueChange={onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.gender && (
            <p className="text-xs text-red-500">
              {errors.gender.message as string}
            </p>
          )}
        </div>

        {/* Designation */}
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium">
            Your Designation <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g. HR Manager"
            {...register("designation")}
            onBlur={onSectionBlur}
          />
          {errors.designation && (
            <p className="text-xs text-red-500">
              {errors.designation.message as string}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
