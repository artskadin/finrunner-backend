/*
  Warnings:

  - Made the column `max_amount` on table `Exchange_pairs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `min_amount` on table `Exchange_pairs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Exchange_pairs" ALTER COLUMN "max_amount" SET NOT NULL,
ALTER COLUMN "max_amount" SET DEFAULT 0.0,
ALTER COLUMN "min_amount" SET NOT NULL,
ALTER COLUMN "min_amount" SET DEFAULT 0.0;
