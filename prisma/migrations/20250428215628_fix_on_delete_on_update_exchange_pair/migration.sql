-- DropForeignKey
ALTER TABLE "Exchange_pairs" DROP CONSTRAINT "Exchange_pairs_from_crypto_asset_id_fkey";

-- DropForeignKey
ALTER TABLE "Exchange_pairs" DROP CONSTRAINT "Exchange_pairs_from_fiat_asset_id_fkey";

-- DropForeignKey
ALTER TABLE "Exchange_pairs" DROP CONSTRAINT "Exchange_pairs_to_crypto_asset_id_fkey";

-- DropForeignKey
ALTER TABLE "Exchange_pairs" DROP CONSTRAINT "Exchange_pairs_to_fiat_asset_id_fkey";

-- AddForeignKey
ALTER TABLE "Exchange_pairs" ADD CONSTRAINT "Exchange_pairs_from_crypto_asset_id_fkey" FOREIGN KEY ("from_crypto_asset_id") REFERENCES "Crypto_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange_pairs" ADD CONSTRAINT "Exchange_pairs_to_crypto_asset_id_fkey" FOREIGN KEY ("to_crypto_asset_id") REFERENCES "Crypto_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange_pairs" ADD CONSTRAINT "Exchange_pairs_from_fiat_asset_id_fkey" FOREIGN KEY ("from_fiat_asset_id") REFERENCES "Fiat_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange_pairs" ADD CONSTRAINT "Exchange_pairs_to_fiat_asset_id_fkey" FOREIGN KEY ("to_fiat_asset_id") REFERENCES "Fiat_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
