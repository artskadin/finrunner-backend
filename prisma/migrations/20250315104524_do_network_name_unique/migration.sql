/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Blockchain_networks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Blockchain_networks_name_key" ON "Blockchain_networks"("name");
