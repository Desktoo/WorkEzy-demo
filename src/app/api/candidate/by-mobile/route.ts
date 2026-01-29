import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { mobile } = await req.json();

  if (!mobile) {
    return NextResponse.json(
      { message: "Mobile number required" },
      { status: 400 }
    );
  }

  const candidate = await prisma.candidate.findUnique({
    where: { phoneNumber: mobile },
    include: {
      skills: true,
      languages: true,
    },
  });

  if (!candidate) {
    return NextResponse.json(
      { message: "Candidate not found" },
      { status: 404 }
    );
  }

  if (!candidate.canUpdateDetails) {
    return NextResponse.json(
      { message: "Update not allowed" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    candidate,
  });
}


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mobile = searchParams.get("mobile");

  if (!mobile) {
    return NextResponse.json({ error: "Mobile required" }, { status: 400 });
  }

  const candidate = await prisma.candidate.findUnique({
    where: { phoneNumber: mobile },
    include: {
      skills: true,
      languages: true,
    },
  });

  if (!candidate) {
    return NextResponse.json({ exists: false });
  }

  return NextResponse.json({
    exists: true,
    candidate,
  });
}
