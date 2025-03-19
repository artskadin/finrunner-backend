/*
  Warnings:

  - You are about to drop the column `pocket_id` on the `Payments` table. All the data in the column will be lost.
  - You are about to drop the `Pockets` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "WalletStatus" AS ENUM ('NEW', 'USED');

-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_pocket_id_fkey";

-- DropForeignKey
ALTER TABLE "Pockets" DROP CONSTRAINT "Pockets_blockchain_network_id_fkey";

-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "pocket_id",
ADD COLUMN     "crypto_wallet_id" UUID;

-- DropTable
DROP TABLE "Pockets";

-- DropEnum
DROP TYPE "PocketStatus";

-- CreateTable
CREATE TABLE "Crypto_wallets" (
    "id" UUID NOT NULL,
    "blockchain_network_id" UUID NOT NULL,
    "address" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "seed_phrase" TEXT,
    "status" "WalletStatus" NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "Crypto_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Crypto_wallets_address_key" ON "Crypto_wallets"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Crypto_wallets_publicKey_key" ON "Crypto_wallets"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "Crypto_wallets_privateKey_key" ON "Crypto_wallets"("privateKey");

-- CreateIndex
CREATE UNIQUE INDEX "Crypto_wallets_seed_phrase_key" ON "Crypto_wallets"("seed_phrase");

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_crypto_wallet_id_fkey" FOREIGN KEY ("crypto_wallet_id") REFERENCES "Crypto_wallets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crypto_wallets" ADD CONSTRAINT "Crypto_wallets_blockchain_network_id_fkey" FOREIGN KEY ("blockchain_network_id") REFERENCES "Blockchain_networks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
