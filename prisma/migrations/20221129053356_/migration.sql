-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "apiURL" TEXT NOT NULL,
    "streamURL" TEXT NOT NULL,
    "accessKey" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Symbols" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "base" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "basePrecision" INTEGER NOT NULL,
    "quotePrecision" INTEGER NOT NULL,
    "minNotional" TEXT NOT NULL,
    "minLotSize" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Symbols_pkey" PRIMARY KEY ("id")
);

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
    "avgPrice" TEXT,
    "comission" TEXT,
    "net" TEXT,
    "isMaker" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Symbols_id_key" ON "Symbols"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Symbols_symbol_key" ON "Symbols"("symbol");

-- CreateIndex
CREATE INDEX "user_id" ON "Symbols"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Orders_id_key" ON "Orders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Orders_orderId_key" ON "Orders"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Orders_clientOrderId_key" ON "Orders"("clientOrderId");

-- CreateIndex
CREATE INDEX "order_symbol_index" ON "Orders"("symbol");

-- AddForeignKey
ALTER TABLE "Symbols" ADD CONSTRAINT "Symbols_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
