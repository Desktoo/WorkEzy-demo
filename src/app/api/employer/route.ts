import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";
import { employerRegistrationBackendSchema } from "@/lib/validations/backend/employerRegistrationBackend.schema";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Backend validation (CRITICAL)

    const validatedData = employerRegistrationBackendSchema.parse(body);

    const employer = await prisma.employer.create({
      data: { ...validatedData, clerkId: userId },
    });

    return NextResponse.json({ success: true, employer }, { status: 201 });
  } catch (error: unknown) {
    console.error("Employer POST error:", error);

    if (error instanceof ZodError) {
      console.error("Zod validation issues:", error.issues);

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

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const employer = await prisma.employer.findUnique({
    where: { clerkId: userId },
  });

  if (!employer) {
    return NextResponse.json(
      { message: "Employer not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ employer });
}


export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate incoming data
    const validatedData = employerRegistrationBackendSchema.parse(body);

    // Ensure employer exists
    const existingEmployer = await prisma.employer.findUnique({
      where: { clerkId: userId },
    });

    if (!existingEmployer) {
      return NextResponse.json(
        { success: false, message: "Employer not found" },
        { status: 404 }
      );
    }

    // Update employer
    const updatedEmployer = await prisma.employer.update({
      where: { clerkId: userId },
      data: {
        ...validatedData,

        // IMPORTANT:
        // Any update should trigger re-verification
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { success: true, employer: updatedEmployer },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Employer PATCH error:", error);

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
      { success: false, message: "Failed to update employer" },
      { status: 500 }
    );
  }
}
