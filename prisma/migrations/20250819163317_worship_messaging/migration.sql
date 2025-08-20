-- AlterEnum
ALTER TYPE "public"."MessageType" ADD VALUE 'WORSHIP_TEAM';

-- CreateTable
CREATE TABLE "public"."WorshipMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "worshipMinistryId" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WorshipMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorshipMessage_worshipMinistryId_idx" ON "public"."WorshipMessage"("worshipMinistryId");

-- AddForeignKey
ALTER TABLE "public"."WorshipMessage" ADD CONSTRAINT "WorshipMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorshipMessage" ADD CONSTRAINT "WorshipMessage_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
