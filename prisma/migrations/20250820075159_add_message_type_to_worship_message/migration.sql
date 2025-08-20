-- AlterEnum
ALTER TYPE "public"."MessageType" ADD VALUE 'PASTORAL_CARE';

-- AlterTable
ALTER TABLE "public"."WorshipMessage" ADD COLUMN     "messageType" "public"."MessageType" NOT NULL DEFAULT 'GENERAL',
ALTER COLUMN "worshipMinistryId" DROP NOT NULL;
