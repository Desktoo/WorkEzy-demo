import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    const employer = await prisma.employer.findUnique({
      where: { clerkId: userId },
    });

    if (!employer) {
      return NextResponse.json(
        {
          authenticated: true,
          registered: false,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        registered: true,
        employer,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("CHECK API error:", error);

    return NextResponse.json(
      {
        authenticated: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
