import QuestionCard from "@/components/cards/QuestionCard";
import { Button } from "@/components/ui/button";
import { PostJobFormValues } from "@/lib/validations/frontend/jobPost.schema";
import { PlusCircle } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";

export default function FilteringQuestionSection({
  form,
  onSectionBlur,
}: {
  form: UseFormReturn<PostJobFormValues>;
  onSectionBlur: () => void;
}) {
  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "filteringQuestions",
  });

  const handleAddButton = () => {
    append({ question: "", expectedAnswer: "yes" });
  };

  return (
    <section className="mb-8 flex flex-col border-b-2 pb-8 border-gray-200">
      <div className="mb-4 flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold">Filtering Questions</h3>
          <label className="text-sm text-gray-600">
            Add up to 3 questions to filter candidates.
          </label>
        </div>

        <Button
          type="button"
          onClick={handleAddButton}
          disabled={fields.length >= 3}
          className="bg-gray-100 border text-gray-600 flex gap-2 disabled:opacity-50 hover:bg-gray-200"
        >
          <PlusCircle />
          Add
        </Button>
      </div>

      {/* Render Question Cards */}
      <div className="flex flex-col gap-4">
        {fields.map((id, index) => (
          <QuestionCard
            key={index}
            form={form}
            onSectionBlur={onSectionBlur}
            index={index}
            onDelete={() => remove(index)}
          />
        ))}
      </div>
    </section>
  );
}
