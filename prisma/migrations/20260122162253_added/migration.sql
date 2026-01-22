/*
  Warnings:

  - Added the required column `expectedAnswer` to the `JobAiScreeningQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobAiScreeningQuestion" ADD COLUMN     "expectedAnswer" TEXT NOT NULL;
