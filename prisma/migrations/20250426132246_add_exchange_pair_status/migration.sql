/*
  Warnings:

  - You are about to drop the column `is_active` on the `Exchange_pairs` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ExchangePairStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Exchange_pairs" DROP COLUMN "is_active",
ADD COLUMN     "status" "ExchangePairStatus" NOT NULL DEFAULT 'INACTIVE';
