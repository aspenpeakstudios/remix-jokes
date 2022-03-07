/*
  Warnings:

  - You are about to drop the `AuditLogs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "AuditLogs";

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL DEFAULT E'app',
    "fileName" TEXT,
    "message" TEXT NOT NULL DEFAULT E'new message',
    "additional" TEXT,
    "author" TEXT NOT NULL DEFAULT E'system',

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);
