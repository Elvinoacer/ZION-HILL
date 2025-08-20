-- AlterTable
ALTER TABLE "public"."SongProposal" ADD COLUMN     "spotifyUrl" TEXT,
ADD COLUMN     "youtubeUrl" TEXT;

-- AddForeignKey
ALTER TABLE "public"."SongProposal" ADD CONSTRAINT "SongProposal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
