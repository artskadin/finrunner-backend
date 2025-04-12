/*
  Warnings:

  - A unique constraint covering the columns `[from_currency_id,to_currency_id,from_blockchain_network_id,to_blockchain_network_id,from_fiat_provider_id,to_fiat_provider_id]` on the table `Exchange_pairs` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Exchange_pairs_from_currency_id_to_currency_id_key";

-- AlterTable
ALTER TABLE "Exchange_pairs" ADD COLUMN     "from_blockchain_network_id" UUID,
ADD COLUMN     "from_fiat_provider_id" UUID,
ADD COLUMN     "to_blockchain_network_id" UUID,
ADD COLUMN     "to_fiat_provider_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "Exchange_pairs_from_currency_id_to_currency_id_from_blockch_key" ON "Exchange_pairs"("from_currency_id", "to_currency_id", "from_blockchain_network_id", "to_blockchain_network_id", "from_fiat_provider_id", "to_fiat_provider_id");

-- AddForeignKey
ALTER TABLE "Exchange_pairs" ADD CONSTRAINT "Exchange_pairs_from_blockchain_network_id_fkey" FOREIGN KEY ("from_blockchain_network_id") REFERENCES "Blockchain_networks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange_pairs" ADD CONSTRAINT "Exchange_pairs_to_blockchain_network_id_fkey" FOREIGN KEY ("to_blockchain_network_id") REFERENCES "Blockchain_networks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange_pairs" ADD CONSTRAINT "Exchange_pairs_from_fiat_provider_id_fkey" FOREIGN KEY ("from_fiat_provider_id") REFERENCES "Fiat_providers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange_pairs" ADD CONSTRAINT "Exchange_pairs_to_fiat_provider_id_fkey" FOREIGN KEY ("to_fiat_provider_id") REFERENCES "Fiat_providers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
