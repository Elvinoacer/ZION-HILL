-- CreateTable
CREATE TABLE "public"."WorshipSet" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "leaderId" TEXT NOT NULL,
    "arrangedSongs" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorshipSet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."WorshipSet" ADD CONSTRAINT "WorshipSet_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
