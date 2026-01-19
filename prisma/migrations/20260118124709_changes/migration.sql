/*
  Warnings:

  - You are about to drop the `CandidateIndustryExperience` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `industry` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearsOfExperience` to the `Candidate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CandidateIndustryExperience" DROP CONSTRAINT "CandidateIndustryExperience_candidateId_fkey";

-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "industry" TEXT NOT NULL,
ADD COLUMN     "yearsOfExperience" TEXT NOT NULL;

-- DropTable
DROP TABLE "CandidateIndustryExperience";
