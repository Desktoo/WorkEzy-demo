import { NextResponse } from "next/server";
import axios from "axios";
import { otpStore } from "@/store/otpStore";

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


export async function POST(req: Request) {
  try {
    const { mobile } = await req.json();

    // Basic validation
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return NextResponse.json(
        { message: "Invalid mobile number" },
        { status: 400 }
      );
    }

    // 1️⃣ Generate OTP
    const otp = generateOtp();
    const expiresAt = Date.now() + OTP_EXPIRY_MS;

    // 2️⃣ Store OTP server-side
    otpStore.set(mobile, { otp, expiresAt });

    // 3️⃣ Send OTP via Authkey INTERNAL OTP API
    const response = await axios.post(
      "https://console.authkey.io/restapi/requestjson.php",
      {
        country_code: "91",
        mobile,
        otp, // 👈 server-generated OTP
        sid: process.env.AUTHKEY_TEMPLATE_ID, // e.g. 16980 (Authkey internal SID)
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${process.env.AUTHKEY_API_KEY}`,
        },
      }
    );

    // 4️⃣ Validate Authkey response
    if (response.data?.status !== "Success") {
      console.error("Authkey failed:", response.data);
      return NextResponse.json(
        { message: "Failed to send OTP" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(
      "Send OTP error:",
      error?.response?.data || error.message
    );

    return NextResponse.json(
      { message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
