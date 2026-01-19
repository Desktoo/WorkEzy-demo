import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function PostAuthPage() {


  const { userId } = await auth();
  if (!userId) redirect("/auth");

  const employer = await prisma.employer.findUnique({
    where: { clerkId: userId },
    select: { status: true },
  });

  if (!employer) {
    redirect(`/employer-registration`);
  }

  if (employer.status === "APPROVED") {
    redirect("/dashboard");
  }

  redirect("/profile-under-review");
}
