import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PostJobFormValues } from "@/lib/validations/frontend/jobPost.schema";
import { UseFormReturn } from "react-hook-form";

export default function JobDescriptionSection({
  form,
  onSectionBlur,
}: {
  form: UseFormReturn<PostJobFormValues>;
  onSectionBlur: () => void;
}) {
  const {
    register,
    formState: { errors },
  } = form;

  const InsertSample = () => {
    form.setValue("jobDescription", SAMPLE_JOB_DESCRIPTION, {
      shouldDirty: true,
      shouldValidate: true,
    });

    // Persist draft immediately
    onSectionBlur();
  };

  return (
    <section className="mb-8 flex flex-col border-b-2 pb-8 border-gray-200">
      <div className="mb-2 flex justify-between">
        <h3 className="text-lg font-bold">Job Description</h3>
        <Button
          type="button"
          onClick={InsertSample}
          className="bg-gray-100 border text-gray-600 hover:bg-gray-200"
        >
          Insert Sample Text
        </Button>
      </div>
      <Textarea
        className="h-32"
        placeholder="Describe the responsibilities, requirements and benefits of the job"
        {...register("jobDescription")}
        onBlur={onSectionBlur}
      />
      {errors.jobDescription && (
        <p className="text-xs text-red-500">{errors.jobDescription.message}</p>
      )}
    </section>
  );
}

const SAMPLE_JOB_DESCRIPTION = `We are looking for a motivated and skilled professional to join our team.

Responsibilities:
• Execute assigned tasks efficiently
• Collaborate with team members
• Meet project deadlines`;
