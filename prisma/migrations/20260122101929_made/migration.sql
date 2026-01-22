/*
  Warnings:

  - You are about to drop the column `isAiFit` on the `CandidateAiAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `remarks` on the `CandidateAiAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `activeCredits` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the `Otp` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[applicationId,questionId]` on the table `CandidateAiAnswer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transactionId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentId` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCredits` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CandidateAiAnswer" DROP COLUMN "isAiFit",
DROP COLUMN "remarks";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "paymentId" TEXT NOT NULL,
ADD COLUMN     "totalCredits" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "activeCredits",
ADD COLUMN     "creditsPerJob" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Otp";

-- CreateIndex
CREATE UNIQUE INDEX "CandidateAiAnswer_applicationId_questionId_key" ON "CandidateAiAnswer"("applicationId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "Job_paymentId_key" ON "Job"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
