/*
  Warnings:

  - The values [COMPLETE] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "FiatProviderType" AS ENUM ('BANK', 'PAYMENT_SYSTEM', 'PHONE_NUMBER');

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');
ALTER TABLE "Payments" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
COMMIT;

-- CreateTable
CREATE TABLE "Fiat_providers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FiatProviderType" NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "Fiat_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fiat_provider_currencies" (
    "id" UUID NOT NULL,
    "fiat_provider_id" UUID NOT NULL,
    "currency_id" UUID NOT NULL,

    CONSTRAINT "Fiat_provider_currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fiat_payment_details" (
    "id" UUID NOT NULL,
    "payment_id" UUID NOT NULL,
    "cart_number" TEXT,
    "cart_holder" TEXT,
    "phone_number" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "Fiat_payment_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fiat_payment_details_payment_id_key" ON "Fiat_payment_details"("payment_id");

-- AddForeignKey
ALTER TABLE "Fiat_provider_currencies" ADD CONSTRAINT "Fiat_provider_currencies_fiat_provider_id_fkey" FOREIGN KEY ("fiat_provider_id") REFERENCES "Fiat_providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fiat_provider_currencies" ADD CONSTRAINT "Fiat_provider_currencies_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "Currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fiat_payment_details" ADD CONSTRAINT "Fiat_payment_details_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "Payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
