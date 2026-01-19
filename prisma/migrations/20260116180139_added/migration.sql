/*
  Warnings:

  - A unique constraint covering the columns `[clerkId]` on the table `Employer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkId` to the `Employer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employer" ADD COLUMN     "clerkId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Employer_clerkId_key" ON "Employer"("clerkId");
