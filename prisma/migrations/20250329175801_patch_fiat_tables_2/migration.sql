/*
  Warnings:

  - The values [ACCEPT,PAYOUT] on the enum `PaymentType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `target` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentTarget" AS ENUM ('ACCEPT', 'PAYOUT');

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentType_new" AS ENUM ('CRYPTO', 'FIAT');
ALTER TABLE "Payments" ALTER COLUMN "type" TYPE "PaymentType_new" USING ("type"::text::"PaymentType_new");
ALTER TYPE "PaymentType" RENAME TO "PaymentType_old";
ALTER TYPE "PaymentType_new" RENAME TO "PaymentType";
DROP TYPE "PaymentType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Payments" ADD COLUMN     "target" "PaymentTarget" NOT NULL;
