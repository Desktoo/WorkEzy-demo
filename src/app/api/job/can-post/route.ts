import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getActiveUnconsumedPayment } from "@/lib/payments/GetActivePayment";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { canPost: false, reason: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const employer = await prisma.employer.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!employer) {
      return NextResponse.json({
        canPost: false,
        reason: "EMPLOYER_NOT_FOUND",
      });
    }

    const activePayment = await getActiveUnconsumedPayment(employer.id);

    if (!activePayment) {
      return NextResponse.json({
        canPost: false,
        reason: "NO_ACTIVE_PLAN",
      });
    }

    return NextResponse.json({ canPost: true });
  } catch (error) {
    console.error("[CAN_POST_JOB_ERROR]", error);

    return NextResponse.json(
      { canPost: false, reason: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
