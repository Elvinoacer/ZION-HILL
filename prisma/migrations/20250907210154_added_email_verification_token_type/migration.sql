-- AlterEnum
ALTER TYPE "public"."TokenType" ADD VALUE 'EMAIL_VERIFICATION';

-- DropIndex
DROP INDEX "public"."VerificationToken_identifier_token_key";
