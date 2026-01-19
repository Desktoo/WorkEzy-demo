import { Input } from "@/components/ui/input";
import { EmployerRegistrationFormValues } from "@/lib/validations/frontend/employer.schema";
import { UseFormReturn } from "react-hook-form";

export default function VerifyDocsSection({
  form,
}: {
  form: UseFormReturn<EmployerRegistrationFormValues>;
}) {
  const {
    formState: { errors },
  } = form;

  const handlePanCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    form.setValue("panCard", file, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleGstCertificateUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    form.setValue("gstCertificate", file, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <section className="mb-10">
      <h3 className="text-lg font-bold mb-6 border-b-2 pb-4 border-gray-200">
        Verification Documents
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PAN Card */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">
            PAN Card <span className="text-red-500">*</span>
          </label>
          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handlePanCardUpload}
          />
          {errors.panCard && (
            <p className="text-xs text-red-500">{errors.panCard.message}</p>
          )}
        </div>

        {/* GST Certificate */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">
            Company GST Certificate <span className="text-red-500">*</span>
          </label>
          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleGstCertificateUpload}
          />
          {errors.gstCertificate && (
            <p className="text-xs text-red-500">
              {errors.gstCertificate.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
