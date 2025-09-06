-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('OTP', 'PASSWORD_RESET');

-- AlterTable
ALTER TABLE "VerificationToken" ADD COLUMN     "type" "TokenType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_type_key" ON "VerificationToken"("identifier", "token", "type");
