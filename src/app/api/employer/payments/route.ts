import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const employerId = searchParams.get("employerId");
    const onlyValid = searchParams.get("onlyValid") === "true";

    if (!employerId) {
      return NextResponse.json(
        {
          success: false,
          message: "employerId is required",
        },
        { status: 400 }
      );
    }

    // 1️⃣ Fetch payments directly by employerId
    const payments = await prisma.payment.findMany({
      where: {
        employerId,
        ...(onlyValid && {
          status: "SUCCESS",
          isConsumed: false,
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
      take: onlyValid ? 1 : 5,
      select: {
        id: true,
        transactionId: true,
        provider: true,
        amount: true,
        currency: true,
        status: true,
        isConsumed: true,
        createdAt: true,
        plan: {
          select: {
            id: true,
            name: true,
            price: true,
            creditsPerJob: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        payments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET employer payments error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch employer payments",
      },
      { status: 500 }
    );
  }
}
