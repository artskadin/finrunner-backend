/*
  Warnings:

  - A unique constraint covering the columns `[crypto_wallet_id]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Crypto_wallet_encryption_keys" (
    "id" UUID NOT NULL,
    "crypto_wallet_id" UUID NOT NULL,
    "iv" TEXT NOT NULL,

    CONSTRAINT "Crypto_wallet_encryption_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Crypto_wallet_encryption_keys_crypto_wallet_id_key" ON "Crypto_wallet_encryption_keys"("crypto_wallet_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payments_crypto_wallet_id_key" ON "Payments"("crypto_wallet_id");

-- AddForeignKey
ALTER TABLE "Crypto_wallet_encryption_keys" ADD CONSTRAINT "Crypto_wallet_encryption_keys_crypto_wallet_id_fkey" FOREIGN KEY ("crypto_wallet_id") REFERENCES "Crypto_wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
