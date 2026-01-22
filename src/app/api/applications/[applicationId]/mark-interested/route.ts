import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {

    const { applicationId } = await params

    await prisma.application.update({
      where: { id: applicationId },
      data: { status: "INTERESTED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update status" },
      { status: 500 }
    );
  }
}
