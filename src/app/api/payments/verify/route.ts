import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    /* --------------------------------
       1. Auth
    --------------------------------- */
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* --------------------------------
       2. Parse body
    --------------------------------- */
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
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

    /* --------------------------------
       3. Resolve employer
    --------------------------------- */
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

    /* --------------------------------
       4. Verify Razorpay signature
    --------------------------------- */
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET_KEY!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    /* --------------------------------
       5. Validate plan exists
       NOTE: Credits are NOT assigned here.
       Credits are snapshotted at JOB creation.
    --------------------------------- */
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      select: { id: true, price: true },
    });

    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    /* --------------------------------
       6. Prevent duplicate payments
    --------------------------------- */
    const existingPayment = await prisma.payment.findUnique({
      where: { transactionId: razorpay_payment_id },
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: "Payment already recorded" },
        { status: 409 }
      );
    }

    /* --------------------------------
       7. Create payment
       NOTE: Payment only unlocks job creation.
    --------------------------------- */
    const payment = await prisma.payment.create({
      data: {
        transactionId: razorpay_payment_id,
        provider: "razorpay",
        amount: plan.price,
        currency: "INR",
        status: "SUCCESS",
        isConsumed: false,
        employerId: employer.id,
        planId: plan.id,
      },
    });

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error("[RAZORPAY_VERIFY_ERROR]", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
