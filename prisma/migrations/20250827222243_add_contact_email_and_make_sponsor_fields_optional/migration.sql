-- DropForeignKey
ALTER TABLE "public"."Sponsor" DROP CONSTRAINT "Sponsor_eventId_fkey";

-- AlterTable
ALTER TABLE "public"."Sponsor" ADD COLUMN     "contactEmail" TEXT,
ALTER COLUMN "logoUrl" DROP NOT NULL,
ALTER COLUMN "eventId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Sponsor" ADD CONSTRAINT "Sponsor_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
