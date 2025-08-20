-- DropForeignKey
ALTER TABLE "public"."TopicFeedback" DROP CONSTRAINT "TopicFeedback_topicId_fkey";

-- AddForeignKey
ALTER TABLE "public"."TopicFeedback" ADD CONSTRAINT "TopicFeedback_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."ForumTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
