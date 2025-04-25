/*
  Warnings:

  - You are about to drop the column `from_crypto_unit_id` on the `Exchange_pairs` table. All the data in the column will be lost.
  - You are about to drop the column `from_currency_id` on the `Exchange_pairs` table. All the data in the column will be lost.
  - You are about to drop the column `from_fiat_unit_id` on the `Exchange_pairs` table. All the data in the column will be lost.
  - You are about to drop the column `to_crypto_unit_id` on the `Exchange_pairs` table. All the data in the column will be lost.
  - You are about to drop the column `to_currency_id` on the `Exchange_pairs` table. All the data in the column will be lost.
  - You are about to drop the column `to_fiat_unit_id` on the `Exchange_pairs` table. All the data in the column will be lost.
  - You are about to drop the `Currency_blockchain_networks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Fiat_provider_currencies` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[from_crypto_asset_id,to_crypto_asset_id,from_fiat_asset_id,to_fiat_asset_id]` on the table `Exchange_pairs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,type]` on the table `Fiat_providers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Currency_blockchain_networks" DROP CONSTRAINT "Currency_blockchain_networks_blockchain_network_id_fkey";

-- DropForeignKey
ALTER TABLE "Currency_blockchain_networks" DROP CONSTRAINT "Currency_blockchain_networks_currency_id_fkey";

-- DropForeignKey
ALTER TABLE "Exchange_pairs" DROP CONSTRAINT "Exchange_pairs_from_crypto_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "Exchange_pairs" DROP CONSTRAINT "Exchange_pairs_from_fiat_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "Exchange_pairs" DROP CONSTRAINT "Exchange_pairs_to_crypto_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "Exchange_pairs" DROP CONSTRAINT "Exchange_pairs_to_fiat_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "Fiat_provider_currencies" DROP CONSTRAINT "Fiat_provider_currencies_currency_id_fkey";

-- DropForeignKey
ALTER TABLE "Fiat_provider_currencies" DROP CONSTRAINT "Fiat_provider_currencies_fiat_provider_id_fkey";

-- DropIndex
DROP INDEX "Exchange_pairs_from_crypto_unit_id_to_crypto_unit_id_from_f_key";

-- AlterTable
ALTER TABLE "Exchange_pairs" DROP COLUMN "from_crypto_unit_id",
DROP COLUMN "from_currency_id",
DROP COLUMN "from_fiat_unit_id",
DROP COLUMN "to_crypto_unit_id",
DROP COLUMN "to_currency_id",
DROP COLUMN "to_fiat_unit_id",
ADD COLUMN     "from_crypto_asset_id" UUID,
ADD COLUMN     "from_fiat_asset_id" UUID,
ADD COLUMN     "to_crypto_asset_id" UUID,
ADD COLUMN     "to_fiat_asset_id" UUID;

-- DropTable
DROP TABLE "Currency_blockchain_networks";

-- DropTable
DROP TABLE "Fiat_provider_currencies";

-- CreateTable
CREATE TABLE "Crypto_assets" (
    "id" UUID NOT NULL,
    "currency_id" UUID NOT NULL,
    "blockchain_network_id" UUID NOT NULL,

    CONSTRAINT "Crypto_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fiat_assets" (
    "id" UUID NOT NULL,
    "fiat_provider_id" UUID NOT NULL,
    "currency_id" UUID NOT NULL,

    CONSTRAINT "Fiat_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Crypto_assets_currency_id_blockchain_network_id_key" ON "Crypto_assets"("currency_id", "blockchain_network_id");

-- CreateIndex
CREATE UNIQUE INDEX "Fiat_assets_fiat_provider_id_currency_id_key" ON "Fiat_assets"("fiat_provider_id", "currency_id");

-- CreateIndex
CREATE UNIQUE INDEX "Exchange_pairs_from_crypto_asset_id_to_crypto_asset_id_from_key" ON "Exchange_pairs"("from_crypto_asset_id", "to_crypto_asset_id", "from_fiat_asset_id", "to_fiat_asset_id");

-- CreateIndex
CREATE UNIQUE INDEX "fiat_provider_name_type_key" ON "Fiat_providers"("name", "type");

-- AddForeignKey
ALTER TABLE "Crypto_assets" ADD CONSTRAINT "Crypto_assets_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "Currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crypto_assets" ADD CONSTRAINT "Crypto_assets_blockchain_network_id_fkey" FOREIGN KEY ("blockchain_network_id") REFERENCES "Blockchain_networks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fiat_assets" ADD CONSTRAINT "Fiat_assets_fiat_provider_id_fkey" FOREIGN KEY ("fiat_provider_id") REFERENCES "Fiat_providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fiat_assets" ADD CONSTRAINT "Fiat_assets_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "Currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange_pairs" ADD CONSTRAINT "Exchange_pairs_from_crypto_asset_id_fkey" FOREIGN KEY ("from_crypto_asset_id") REFERENCES "Crypto_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange_pairs" ADD CONSTRAINT "Exchange_pairs_to_crypto_asset_id_fkey" FOREIGN KEY ("to_crypto_asset_id") REFERENCES "Crypto_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange_pairs" ADD CONSTRAINT "Exchange_pairs_from_fiat_asset_id_fkey" FOREIGN KEY ("from_fiat_asset_id") REFERENCES "Fiat_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange_pairs" ADD CONSTRAINT "Exchange_pairs_to_fiat_asset_id_fkey" FOREIGN KEY ("to_fiat_asset_id") REFERENCES "Fiat_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
