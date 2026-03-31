-- CreateEnum
CREATE TYPE "MeetupStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED');
CREATE TYPE "MeetupCategory" AS ENUM ('FIVE_K', 'TEN_K', 'HALF_MARATHON', 'MARATHON', 'TRAIL', 'SOCIAL', 'TRAINING');
CREATE TYPE "MeetupSource" AS ENUM ('USER_SUBMITTED', 'PARKRUN', 'STRAVA_CLUB', 'MANUAL_ADMIN');

-- CreateTable
CREATE TABLE "meetups" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "category" "MeetupCategory" NOT NULL,
    "status" "MeetupStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "source" "MeetupSource" NOT NULL DEFAULT 'USER_SUBMITTED',
    "externalId" TEXT,
    "submitterName" TEXT NOT NULL,
    "submitterEmail" TEXT NOT NULL,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNote" TEXT,
    "maxParticipants" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meetups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "meetups_externalId_key" ON "meetups"("externalId");
