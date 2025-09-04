-- CreateTable
CREATE TABLE "public"."BirthdayWish" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BirthdayWish_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."BirthdayWish" ADD CONSTRAINT "BirthdayWish_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BirthdayWish" ADD CONSTRAINT "BirthdayWish_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
