/*
  Warnings:

  - A unique constraint covering the columns `[token_standart]` on the table `Blockchain_networks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token_standart` to the `Blockchain_networks` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Blockchain_networks_name_key";

-- AlterTable
ALTER TABLE "Blockchain_networks" ADD COLUMN     "token_standart" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Blockchain_networks_token_standart_key" ON "Blockchain_networks"("token_standart");
