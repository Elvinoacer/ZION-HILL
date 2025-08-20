-- CreateTable
CREATE TABLE "public"."ProjectApplication" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "notes" TEXT,
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectApplication_projectId_applicantId_key" ON "public"."ProjectApplication"("projectId", "applicantId");

-- AddForeignKey
ALTER TABLE "public"."ProjectApplication" ADD CONSTRAINT "ProjectApplication_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectApplication" ADD CONSTRAINT "ProjectApplication_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
