/*
  Warnings:

  - You are about to drop the column `dob` on the `Candidate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "dob",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3);
