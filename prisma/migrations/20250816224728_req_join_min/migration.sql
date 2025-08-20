-- CreateTable
CREATE TABLE "public"."MinistryJoinRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ministryId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MinistryJoinRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MinistryJoinRequest_userId_ministryId_key" ON "public"."MinistryJoinRequest"("userId", "ministryId");

-- AddForeignKey
ALTER TABLE "public"."MinistryJoinRequest" ADD CONSTRAINT "MinistryJoinRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MinistryJoinRequest" ADD CONSTRAINT "MinistryJoinRequest_ministryId_fkey" FOREIGN KEY ("ministryId") REFERENCES "public"."Ministry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
