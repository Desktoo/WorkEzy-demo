import { prisma } from "@/lib/prisma";

export async function getActiveUnconsumedPayment(employerId: string) {
  return prisma.payment.findFirst({
    where: {
      employerId,
      status: "SUCCESS",
      isConsumed: false,
    },
    orderBy: {
      createdAt: "desc", // latest payment wins
    },
  });
}
