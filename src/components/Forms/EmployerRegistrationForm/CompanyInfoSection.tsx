import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMPANY_SIZES, INDIA_STATES } from "@/lib/constants/selectOptions";
import { EmployerRegistrationFormValues } from "@/lib/validations/frontend/employer.schema";
import { UploadCloud } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

export default function CompanyInfoSection({
  form,
  onSectionBlur,
}: {
  form: UseFormReturn<EmployerRegistrationFormValues>;
  onSectionBlur: () => void;
}) {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = form;

  const [preview, setPreview] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Set the file in RHF for Zod validation
      setValue("companyLogo", file, { shouldValidate: true });

      // Create a local URL for the preview image
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="mb-10">
      <h3 className="text-lg font-bold mb-6 border-b-2 pb-4 border-gray-200">
        Company Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Company Logo */}
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium">
            Upload Company Logo <span className="text-red-500">*</span>
          </label>

          <label
            htmlFor="companyLogo"
            className="
      relative
      flex
      items-center
      justify-center
      w-full
      h-40
      border-2
      border-dashed
      rounded-lg
      cursor-pointer
      hover:bg-muted
      transition
      overflow-hidden
    "
          >
            {preview ? (
              <Image
                src={preview}
                alt="Company logo preview"
                fill
                className="object-contain p-4"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <UploadCloud className="h-8 w-8" />
                <span className="text-sm">Upload Logo</span>
              </div>
            )}
          </label>

          <input
            id="companyLogo"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />

          {errors.companyLogo && (
            <p className="text-xs text-red-500">
              {errors.companyLogo.message as string}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {/* Company Name */}
          <div className="space-y-2 flex flex-col">
            <label className="text-sm font-medium">
              Company Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g. Acme Industries Pvt. Ltd."
              {...register("companyName")}
              onBlur={onSectionBlur}
            />
            {errors.companyName && (
              <p className="text-xs text-red-500">
                {errors.companyName.message}
              </p>
            )}
          </div>

          {/* Industry */}
          <div className="space-y-2 flex flex-col">
            <label className="text-sm font-medium">
              Industry <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g. Construction, Manufacturing"
              {...register("industry")}
              onBlur={onSectionBlur}
            />
            {errors.industry && (
              <p className="text-xs text-red-500">{errors.industry.message}</p>
            )}
          </div>

          {/* Number of Employees */}
          <div className="space-y-2 flex flex-col ">
            <label className="text-sm font-medium">
              Number of Employees <span className="text-red-500">*</span>
            </label>

            <Controller
              control={control}
              name="numOfEmployees"
              render={({ field: { onChange, value } }) => (
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_SIZES.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.numOfEmployees && (
              <p className="text-xs text-red-500">
                {errors.numOfEmployees.message}
              </p>
            )}
          </div>
        </div>

        {/* Company Social Media */}
        <div className="space-y-2 flex flex-col md:col-span-1">
          <label className="text-sm font-medium">
            Company Social Media Link (LinkedIn / Website)
          </label>
          <Input
            placeholder="https://..."
            {...register("socialMedia")}
            onBlur={onSectionBlur}
          />
          {errors.socialMedia && (
            <p className="text-xs text-red-500">
              {errors.socialMedia.message}
            </p>
          )}
        </div>

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

          <Controller
            control={control}
            name="state"
            render={({ field: { onChange, value } }) => (
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {INDIA_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
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
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium">
            Country <span className="text-red-500">*</span>
          </label>
          <Input {...register("country")} disabled />
        </div>
      </div>
    </section>
  );
}
