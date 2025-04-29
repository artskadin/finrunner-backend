/*
  Warnings:

  - Made the column `updated_at` on table `Exchange_pairs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Exchange_pairs" ALTER COLUMN "updated_at" SET NOT NULL;
