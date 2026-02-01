-- CreateEnum
CREATE TYPE "ArchivedUserRole" AS ENUM ('EMPLOYER', 'CANDIDATE');

-- CreateTable
CREATE TABLE "ArchivedUser" (
    "id" TEXT NOT NULL,
    "originalId" TEXT NOT NULL,
    "role" "ArchivedUserRole" NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "gender" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "companyName" TEXT,
    "designation" TEXT,
    "industry" TEXT,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArchivedUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ArchivedUser_originalId_idx" ON "ArchivedUser"("originalId");
