import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
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

    const { planId } = await req.json();

    if (!planId) {
      return NextResponse.json(
        { error: "planId is required" },
        { status: 400 }
      );
    }

    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      select: { id: true, name: true, price: true },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY!,
      key_secret: process.env.RAZORPAY_API_SECRET_KEY!,
    });

    const order = await razorpay.orders.create({
      amount: plan.price * 100,
      currency: "INR",
      receipt: `ord_${crypto.randomUUID().slice(0, 12)}`,
      notes: {
        planId: plan.id,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan,
    });
  } catch (error) {
    console.error("[RAZORPAY_ORDER_ERROR]", error);

    return NextResponse.json(
      { error: "Unable to create Razorpay order" },
      { status: 500 }
    );
  }
}
