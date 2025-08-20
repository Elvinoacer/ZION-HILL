-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "donorEmail" TEXT,
ADD COLUMN     "donorName" TEXT,
ADD COLUMN     "recurring" BOOLEAN NOT NULL DEFAULT false;
