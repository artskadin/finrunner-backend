/*
  Warnings:

  - Added the required column `field_name` to the `Crypto_wallet_encryption_keys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Crypto_wallet_encryption_keys" ADD COLUMN     "field_name" TEXT NOT NULL;
