/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `Candidate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Candidate_phoneNumber_key" ON "Candidate"("phoneNumber");
