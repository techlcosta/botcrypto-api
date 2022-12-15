/*
  Warnings:

  - A unique constraint covering the columns `[type,symbol,interval,userId]` on the table `Monitors` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Monitors_type_symbol_interval_key";

-- CreateIndex
CREATE UNIQUE INDEX "Monitors_type_symbol_interval_userId_key" ON "Monitors"("type", "symbol", "interval", "userId");
