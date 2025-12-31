-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('UP', 'DOWN');

-- CreateEnum
CREATE TYPE "AlertRuleType" AS ENUM ('CONSECUTIVE_FAILS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "healthPath" TEXT NOT NULL DEFAULT '/health',
    "method" TEXT NOT NULL DEFAULT 'GET',
    "expectedStatus" INTEGER NOT NULL DEFAULT 200,
    "timeoutMs" INTEGER NOT NULL DEFAULT 5000,
    "intervalSec" INTEGER NOT NULL DEFAULT 60,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastStatus" "ServiceStatus",
    "lastLatencyMs" INTEGER,
    "lastCheckedAt" TIMESTAMP(3),

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckRun" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ServiceStatus" NOT NULL,
    "statusCode" INTEGER,
    "latencyMs" INTEGER,
    "errorMessage" TEXT,

    CONSTRAINT "CheckRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertRule" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "type" "AlertRuleType" NOT NULL,
    "threshold" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AlertRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertEvent" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,

    CONSTRAINT "AlertEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Service_enabled_idx" ON "Service"("enabled");

-- CreateIndex
CREATE INDEX "Service_lastStatus_idx" ON "Service"("lastStatus");

-- CreateIndex
CREATE INDEX "CheckRun_serviceId_timestamp_idx" ON "CheckRun"("serviceId", "timestamp");

-- CreateIndex
CREATE INDEX "CheckRun_timestamp_idx" ON "CheckRun"("timestamp");

-- CreateIndex
CREATE INDEX "AlertRule_serviceId_enabled_idx" ON "AlertRule"("serviceId", "enabled");

-- CreateIndex
CREATE INDEX "AlertEvent_serviceId_triggeredAt_idx" ON "AlertEvent"("serviceId", "triggeredAt");

-- CreateIndex
CREATE INDEX "AlertEvent_triggeredAt_idx" ON "AlertEvent"("triggeredAt");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckRun" ADD CONSTRAINT "CheckRun_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertRule" ADD CONSTRAINT "AlertRule_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertEvent" ADD CONSTRAINT "AlertEvent_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertEvent" ADD CONSTRAINT "AlertEvent_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "AlertRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
