/*
  Warnings:

  - Made the column `updated_at` on table `Fiat_providers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Fiat_providers" ALTER COLUMN "updated_at" SET NOT NULL;
