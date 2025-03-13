/*
  Warnings:

  - A unique constraint covering the columns `[refresh_token]` on the table `jwt_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "jwt_tokens_refresh_token_key" ON "jwt_tokens"("refresh_token");
