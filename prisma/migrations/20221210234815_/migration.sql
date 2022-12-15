-- CreateTable
CREATE TABLE "Monitors" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL DEFAULT '*',
    "type" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isSystemMonitor" BOOLEAN NOT NULL DEFAULT false,
    "showLogs" BOOLEAN NOT NULL DEFAULT false,
    "broadcastLabel" TEXT,
    "interval" TEXT,
    "indexes" TEXT,
    "userId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Monitors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Monitors_id_key" ON "Monitors"("id");

-- CreateIndex
CREATE INDEX "Monitors_symbol_idx" ON "Monitors"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "Monitors_type_symbol_interval_key" ON "Monitors"("type", "symbol", "interval");

-- AddForeignKey
ALTER TABLE "Monitors" ADD CONSTRAINT "Monitors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "order_symbol_index" RENAME TO "Orders_symbol_idx";
