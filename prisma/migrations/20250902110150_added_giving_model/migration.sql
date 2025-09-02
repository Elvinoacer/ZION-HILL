-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "givingId" TEXT;

-- CreateTable
CREATE TABLE "public"."Giving" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "goalAmount" DOUBLE PRECISION,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),

    CONSTRAINT "Giving_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_givingId_fkey" FOREIGN KEY ("givingId") REFERENCES "public"."Giving"("id") ON DELETE SET NULL ON UPDATE CASCADE;
