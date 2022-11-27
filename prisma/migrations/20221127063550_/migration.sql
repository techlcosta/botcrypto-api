-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "automationId" TEXT,
    "symbol" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "clientOrderId" TEXT NOT NULL,
    "transactionTime" BIGINT NOT NULL,
    "type" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "icebergQuantity" TEXT,
    "obs" TEXT,
    "limitPrice" TEXT,
    "stopPrice" TEXT,
    "avgPrice" DECIMAL(65,30),
    "comission" TEXT,
    "net" DECIMAL(65,30),
    "isMaker" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Orders_id_key" ON "Orders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Orders_orderId_key" ON "Orders"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Orders_clientOrderId_key" ON "Orders"("clientOrderId");
