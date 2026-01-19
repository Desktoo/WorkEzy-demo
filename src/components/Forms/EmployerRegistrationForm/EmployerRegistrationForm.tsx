"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  EmployerRegistrationFormValues,
  employerRegistrationSchema,
} from "@/lib/validations/frontend/employer.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import toast from "react-hot-toast";
import {
  EmployerRegistrationFormDefaultState,
  useEmployerRegistrationStore,
} from "@/store/employerRegistration.store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PersonalInfoSection from "./PersonalInfoSection";
import CompanyInfoSection from "./CompanyInfoSection";
import VerifyDocsSection from "./VerifyDocsSection";
import {
  submitEmployerRegistration,
  updateEmployerProfile,
} from "@/services/employerRegistration.service";
import { useRouter } from "next/navigation";

type EmployerFormMode = "register" | "update";

type Props = {
  mode: EmployerFormMode;
  emailFromUrl?: string;
  initialValues?: EmployerRegistrationFormValues;
};

export default function EmployerRegistrationForm({
  mode,
  emailFromUrl,
  initialValues,
}: Props) {
  const router = useRouter();

  const { draft, setDraft, clearDraft } = useEmployerRegistrationStore();

  const form = useForm<EmployerRegistrationFormValues>({
    resolver: zodResolver(employerRegistrationSchema),
    defaultValues:
      mode === "update"
        ? initialValues
        : EmployerRegistrationFormDefaultState,
  });

  /* ---------------- Draft persistence (REGISTER ONLY) ---------------- */
  const persistDraft = () => {
    if (mode === "register") {
      setDraft(form.getValues());
    }
  };

  /* ---------------- Hydration ---------------- */
  useEffect(() => {
    if (mode === "register" && draft) {
      form.reset(draft);
    }

    if (mode === "update" && initialValues) {
      form.reset(initialValues);
    }

    if (emailFromUrl && !form.getValues("email")) {
      form.setValue("email", emailFromUrl, {
        shouldValidate: true,
        shouldDirty: false,
      });
    }
  }, [mode, draft, initialValues, emailFromUrl, form]);

  /* ---------------- Submit ---------------- */
  const onSubmit = async (data: EmployerRegistrationFormValues) => {
    try {
      if (mode === "register") {
        await submitEmployerRegistration(data);
        clearDraft();
        toast.success("Application submitted!");
        router.push("/profile-under-review");
      }

      if (mode === "update") {
        await updateEmployerProfile(data);
        toast.success("Profile updated successfully!");
        router.push("/profile-under-review");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  return (
    <Card className="w-full max-w-4xl border bg-white shadow-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-[#BE4145]">
          {mode === "register"
            ? "Employer Registration"
            : "Update Employer Details"}
        </CardTitle>
        <CardDescription>
          {mode === "register"
            ? "Fill out the form below to get started"
            : "Update your employer information"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-10">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <PersonalInfoSection form={form} onSectionBlur={persistDraft} />
          <CompanyInfoSection form={form} onSectionBlur={persistDraft} />
          <VerifyDocsSection form={form} />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full text-lg bg-[#BE4145] hover:bg-[#a3363a] text-white"
          >
            {form.formState.isSubmitting
              ? "Submitting..."
              : mode === "register"
              ? "Complete Registration"
              : "Update Details"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
