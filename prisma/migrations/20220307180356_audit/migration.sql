-- CreateTable
CREATE TABLE "AuditLogs" (
    "id" TEXT NOT NULL,
    "area" TEXT NOT NULL DEFAULT E'app',
    "message" TEXT NOT NULL DEFAULT E'new message',
    "additional" TEXT,

    CONSTRAINT "AuditLogs_pkey" PRIMARY KEY ("id")
);
