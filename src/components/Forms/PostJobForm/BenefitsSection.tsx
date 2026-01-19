import { Checkbox } from "@/components/ui/checkbox";
import { BENEFITS } from "@/lib/constants/selectOptions";
import { Controller, UseFormReturn } from "react-hook-form";
import { PostJobFormValues } from "@/lib/validations/frontend/jobPost.schema";

export default function BenefitsSection({
  form,
  onSectionBlur,
}: {
  form: UseFormReturn<PostJobFormValues>;
  onSectionBlur: () => void;
}) {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <section className="mb-8  flex flex-col gap-4">
      <h3 className="text-lg font-bold mb-2 border-b-2 pb-4 border-gray-200">
        Benefits
      </h3>

      <label className="text-gray-500 font-semibold text-sm">
        Select the Benefits you are offering for this job.
      </label>

      <Controller
        control={control}
        name="benefits"
        render={({ field: { value = [], onChange } }) => (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2">
            {BENEFITS.map((benefit) => {
              const checked = value.includes(benefit);

              return (
                <div key={benefit} className="flex gap-2 items-center">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(isChecked) => {
                      if (isChecked) {
                        onChange([...value, benefit]);
                      } else {
                        onChange(value.filter((b) => b !== benefit));
                      }

                      // 🔥 Persist draft immediately
                      onSectionBlur();
                    }}
                  />
                  <label className="text-sm">{benefit}</label>
                </div>
              );
            })}
          </div>
        )}
      />

      {errors.benefits && (
        <p className="text-xs text-red-500">{errors.benefits.message}</p>
      )}
    </section>
  );
}
