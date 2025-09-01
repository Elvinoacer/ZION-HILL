/*
  Warnings:

  - You are about to drop the column `dislikes` on the `ForumPost` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `ForumPost` table. All the data in the column will be lost.
  - You are about to drop the column `dislikes` on the `ForumTopic` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `ForumTopic` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ForumPost" DROP CONSTRAINT "ForumPost_topicId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ForumPost" DROP CONSTRAINT "ForumPost_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ForumTopic" DROP CONSTRAINT "ForumTopic_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PostFeedback" DROP CONSTRAINT "PostFeedback_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PostFeedback" DROP CONSTRAINT "PostFeedback_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TopicFeedback" DROP CONSTRAINT "TopicFeedback_userId_fkey";

-- AlterTable
ALTER TABLE "public"."ForumPost" DROP COLUMN "dislikes",
DROP COLUMN "likes";

-- AlterTable
ALTER TABLE "public"."ForumTopic" DROP COLUMN "dislikes",
DROP COLUMN "likes";

-- AddForeignKey
ALTER TABLE "public"."ForumTopic" ADD CONSTRAINT "ForumTopic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ForumPost" ADD CONSTRAINT "ForumPost_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."ForumTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ForumPost" ADD CONSTRAINT "ForumPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TopicFeedback" ADD CONSTRAINT "TopicFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PostFeedback" ADD CONSTRAINT "PostFeedback_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."ForumPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PostFeedback" ADD CONSTRAINT "PostFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
