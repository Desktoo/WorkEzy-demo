import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Hourglass, CheckCircle2, XCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

export default async function ProfileApprovalPage() {
  const { userId } = await auth();

  if (!userId) return notFound();

  const employer = await prisma.employer.findUnique({
    where: { clerkId: userId },
    select: { status: true },
  });

  if (!employer) return notFound();

  const status = employer.status;

  // if(status === "APPROVED") redirect("/dashboard")

  const STATUS_CONFIG = {
    PENDING: {
      icon: <Hourglass className="h-7 w-7 text-yellow-600" />,
      bg: "bg-yellow-100",
      title: "Profile Under Review",
      description:
        "Thank you for registering with Workezy. Our team is currently reviewing your details. You’ll be updated within 24 hours.",
      showDashboard: false,
    },
    REJECTED: {
      icon: <XCircle className="h-7 w-7 text-red-600" />,
      bg: "bg-red-100",
      title: "Profile Rejected",
      description:
        "Unfortunately, your profile did not meet our verification requirements. Please update your details and resubmit for review.",
      showDashboard: false,
    },
    APPROVED: {
      icon: <CheckCircle2 className="h-7 w-7 text-green-600" />,
      bg: "bg-green-100",
      title: "Profile Approved 🎉",
      description:
        "Your profile has been successfully verified. You now have full access to your employer dashboard.",
      showDashboard: true,
    },
  } as const;

  const current = STATUS_CONFIG[status];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      {/* Logo */}
      <Link href="/" className="mb-8">
        <Image
          src="/assets/workezy-logo.png"
          alt="Workezy Logo"
          width={160}
          height={40}
          priority
        />
      </Link>

      {/* Card */}
      <div className="w-full max-w-md rounded-xl border bg-white shadow-lg p-8 text-center">
        {/* Status Icon */}
        <div
          className={`mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full ${current.bg}`}
        >
          {current.icon}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-2">{current.title}</h2>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-6">
          {current.description}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          {/* Update Employer */}
          {(status === "PENDING" || status === "REJECTED") && (
            <Link href="/update-employer">
              <Button variant="outline" className="w-full font-medium">
                Update Employer Details
              </Button>
            </Link>
          )}

          {/* Dashboard */}
          <Link href="/dashboard">
            <Button
              disabled={!current.showDashboard}
              className={`
                w-full text-white font-medium
                transition-all duration-150
                ${current.showDashboard ? "hover:scale-[1.02] active:scale-95" : "opacity-50 cursor-not-allowed"}
              `}
              style={{ backgroundColor: "#BE4145" }}
            >
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
