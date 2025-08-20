-- CreateTable
CREATE TABLE "public"."SongLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "songProposalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SongLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SongLike_userId_songProposalId_key" ON "public"."SongLike"("userId", "songProposalId");

-- AddForeignKey
ALTER TABLE "public"."SongLike" ADD CONSTRAINT "SongLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SongLike" ADD CONSTRAINT "SongLike_songProposalId_fkey" FOREIGN KEY ("songProposalId") REFERENCES "public"."SongProposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
