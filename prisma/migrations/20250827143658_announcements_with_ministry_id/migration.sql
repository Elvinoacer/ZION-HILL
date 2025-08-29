-- AlterTable
ALTER TABLE "public"."Announcement" ADD COLUMN     "ministryId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Announcement" ADD CONSTRAINT "Announcement_ministryId_fkey" FOREIGN KEY ("ministryId") REFERENCES "public"."Ministry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
