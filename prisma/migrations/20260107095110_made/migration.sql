/*
  Warnings:

  - You are about to drop the column `educationSpecaialization` on the `Candidate` table. All the data in the column will be lost.
  - Added the required column `educationSpecialization` to the `Candidate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "educationSpecaialization",
ADD COLUMN     "educationSpecialization" TEXT NOT NULL,
ALTER COLUMN "photo" DROP NOT NULL;
