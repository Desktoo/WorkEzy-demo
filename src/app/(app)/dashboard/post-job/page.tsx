import PostJobForm from "@/components/Forms/PostJobForm/PostJobForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getActiveUnconsumedPayment } from "@/lib/payments/GetActivePayment";

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const employer = await prisma.employer.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!employer) {
    redirect("/pricing");
  }

  return (
    <div className="flex flex-col gap-5 py-5 contain-layout">
      <div className="border-b pb-4 px-4 flex justify-between">
        <h1 className="text-xl font-bold">Post New Job</h1>
      </div>

      <div className="px-4">
        <Link href="/dashboard">
          <Button className="flex items-center gap-1 font-semibold bg-transparent text-gray-500 hover:bg-transparent hover:text-black">
            <ArrowLeft />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="w-full px-4 pb-8">
        <div className="max-w-3xl mx-auto">
          <PostJobForm />
        </div>
      </div>
    </div>
  );
}
