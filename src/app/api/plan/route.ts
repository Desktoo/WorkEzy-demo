import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const plan = await prisma.plan.create({
      data: body,
    });

    return NextResponse.json({ success: true, plan }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input data",
          issues: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create employer" },
      { status: 500 }
    );
  }
}

export async function GET(_req: Request) {
  try {
    const plans = await prisma.plan.findMany();

    return NextResponse.json(
      { success: true, plans },
      { status: 200 } 
    );
  } catch (error) {
    console.error("Error fetching plans:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
