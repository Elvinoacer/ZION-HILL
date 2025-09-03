-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "otherPaymentMethod" TEXT,
ALTER COLUMN "method" DROP NOT NULL;
