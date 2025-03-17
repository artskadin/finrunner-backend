/*
  Warnings:

  - A unique constraint covering the columns `[from_currency_id,to_currency_id]` on the table `Exchange_pairs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Exchange_pairs_from_currency_id_to_currency_id_key" ON "Exchange_pairs"("from_currency_id", "to_currency_id");
