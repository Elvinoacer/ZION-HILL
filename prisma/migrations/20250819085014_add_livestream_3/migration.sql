-- CreateTable
CREATE TABLE "LiveStream" (
    "id" TEXT NOT NULL,
    "streamUrl" TEXT,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "platform" TEXT,
    "mediaType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveStream_pkey" PRIMARY KEY ("id")
);