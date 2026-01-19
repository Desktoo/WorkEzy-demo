/*
  Warnings:

  - Added the required column `gender` to the `Employer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employer" ADD COLUMN     "gender" TEXT NOT NULL,
ALTER COLUMN "socialMedia" DROP NOT NULL;
