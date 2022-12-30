-- CreateTable
CREATE TABLE "Automations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "indexes" TEXT NOT NULL,
    "conditions" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "showLogs" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Automations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Automations_id_key" ON "Automations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Automations_name_symbol_userId_key" ON "Automations"("name", "symbol", "userId");

-- AddForeignKey
ALTER TABLE "Automations" ADD CONSTRAINT "Automations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
