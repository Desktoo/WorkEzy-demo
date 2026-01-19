import { otpStore } from "@/store/otpStore";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const { mobile, otp } = await req.json();

    console.log("VERIFY OTP REQUEST", { mobile, otp });

    if (!mobile || !otp) {
      return NextResponse.json(
        { message: "Mobile and OTP are required" },
        { status: 400 }
      );
    }

    const record = otpStore.get(mobile);
    console.log("OTP STORE RECORD", record);

    if (!record) {
      return NextResponse.json(
        { message: "OTP expired or not found" },
        { status: 400 }
      );
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(mobile);
      return NextResponse.json(
        { message: "OTP expired" },
        { status: 400 }
      );
    }

    if (record.otp !== otp) {
      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // OTP is valid → invalidate it
    otpStore.delete(mobile);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { message: "OTP verification failed" },
      { status: 500 }
    );
  }
}
