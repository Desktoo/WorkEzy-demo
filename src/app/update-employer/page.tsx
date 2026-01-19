import EmployerRegistrationForm from "@/components/Forms/EmployerRegistrationForm/EmployerRegistrationForm";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function UpdateEmployerPage() {
  const { userId } = await auth();
  if (!userId) return notFound();

  const employer = await prisma.employer.findUnique({
    where: { clerkId: userId },
  });

  if (!employer) return notFound();

  return (
    <div className="min-h-screen flex justify-center my-5 items-center px-4 bg-background">
      <EmployerRegistrationForm
        mode="update"
        initialValues={{
          fullName: employer.fullName,
          email: employer.email,
          gender: employer.gender,
          designation: employer.designation,
          companyLogo: undefined, // files are re-uploaded
          companyName: employer.companyName,
          industry: employer.industry,
          numOfEmployees: employer.numOfEmployees,
          socialMedia: employer.socialMedia ?? "",
          city: employer.city,
          state: employer.state,
          country: "India",
          panCard: undefined,
          gstCertificate: undefined,
        }}
      />
    </div>
  );
}
