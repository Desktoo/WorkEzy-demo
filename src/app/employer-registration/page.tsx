import EmployerRegistrationForm from "@/components/Forms/EmployerRegistrationForm/EmployerRegistrationForm";
import { notFound } from "next/navigation";

type Props = {
  searchParams: Promise<{ email?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const { email } = await searchParams;

  if (!email) notFound();

  return (
    <div className="min-h-screen flex justify-center my-5 items-center px-4 bg-background">
      <EmployerRegistrationForm emailFromUrl={email} mode="register"/>
    </div>
  );
}
