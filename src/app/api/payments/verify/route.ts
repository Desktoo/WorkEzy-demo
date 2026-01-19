import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      amount,
    } = await req.json();

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !planId
    ) {
      return NextResponse.json(
        { error: "Missing payment verification data" },
        { status: 400 }
      );
    }

    const employer = await prisma.employer.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!employer) {
      return NextResponse.json(
        { error: "Employer not found" },
        { status: 404 }
      );
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET_KEY!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.create({
      data: {
        transactionId: razorpay_payment_id,
        provider: "razorpay",
        amount,
        currency: "INR",
        status: "SUCCESS",
        isConsumed: false,

        employerId: employer.id,
        planId,
      },
    });

    return NextResponse.json({ success: true, paymentId: payment.id });
  } catch (error) {
    console.error("[RAZORPAY_VERIFY_ERROR]", error);

    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
