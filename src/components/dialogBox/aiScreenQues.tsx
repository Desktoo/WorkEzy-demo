"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useApplicationStore } from "@/store/applicationStore";
import toast from "react-hot-toast";

/* --------------------------------
   Types
--------------------------------- */

type AiScreeningQuestion = {
  question: string;
  expectedAnswer: "YES" | "NO";
};

type Props = {
  jobId: string;
  open: boolean;
  onClose: () => void;
};

/* --------------------------------
   Component
--------------------------------- */

export default function AiScreenQuesDialog({
  jobId,
  open,
  onClose,
}: Props) {

  const [questions, setQuestions] = useState<AiScreeningQuestion[]>([
    { question: "", expectedAnswer: "YES" },
  ]);

  const selectedCandidateIds = useApplicationStore(
    (s) => s.selectedCandidateIds
  );
  const clearSelectedCandidates = useApplicationStore(
    (s) => s.clearSelectedCandidates
  );

  /* --------------------------------
     Handlers
  --------------------------------- */

  const addQuestion = () => {
    if (questions.length >= 3) return;

    setQuestions([
      ...questions,
      { question: "", expectedAnswer: "YES" },
    ]);
  };

  const updateQuestion = (index: number, value: string) => {
    const copy = [...questions];
    copy[index].question = value;
    setQuestions(copy);
  };

  const updateExpectedAnswer = (
    index: number,
    value: "YES" | "NO"
  ) => {
    const copy = [...questions];
    copy[index].expectedAnswer = value;
    setQuestions(copy);
  };

  const deleteQuestion = (index: number) => {
    if (index === 0) return; // first question locked
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const submit = async () => {
    // ❌ No candidates selected
    if (selectedCandidateIds.length === 0) {
      toast.error("No Candidates Selected")
      return;
    }

    // ❌ No valid questions
    const validQuestions = questions.filter(
      (q) => q.question.trim().length > 0
    );

    if (validQuestions.length === 0) {
      toast.error("No questions Added")
      return;
    }

    const payload = {
      questions: validQuestions,
      candidateIds: selectedCandidateIds,
    };

    try {
      await axios.post(
        `/api/job/${jobId}/ai-screening`,
        payload
      );

      toast.success("AI Screening started")

      clearSelectedCandidates();
      onClose();
    } catch (error) {
      console.log(" this error occured while starting AI Screening: ", error)
      toast.error("Failed to start AI Screening")
    }
  };

  /* --------------------------------
     UI
  --------------------------------- */

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Start AI Screening
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4">
          {questions.map((q, i) => (
            <div
              key={i}
              className="space-y-3 rounded-md border p-4 bg-neutral-100"
            >
              {/* Question input */}
              <div className="flex gap-2">
                <Input
                  placeholder={`Question ${i + 1}`}
                  value={q.question}
                  onChange={(e) =>
                    updateQuestion(i, e.target.value)
                  }
                />

                {i > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-500"
                    onClick={() => deleteQuestion(i)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Expected answer */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Expected Answer
                </Label>

                <RadioGroup
                  value={q.expectedAnswer}
                  onValueChange={(val) =>
                    updateExpectedAnswer(
                      i,
                      val as "YES" | "NO"
                    )
                  }
                  className="flex gap-6"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="YES"
                      id={`yes-${i}`}
                    />
                    <Label htmlFor={`yes-${i}`}>
                      Yes
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="NO"
                      id={`no-${i}`}
                    />
                    <Label htmlFor={`no-${i}`}>
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          ))}

          {/* Add question */}
          <Button
            type="button"
            variant="outline"
            onClick={addQuestion}
            disabled={questions.length >= 3}
          >
            Add Question
          </Button>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <Button onClick={submit}>
            Start Screening
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
