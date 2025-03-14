-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'OPERATOR');

-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('DRAFT', 'PAYMENT', 'UNPAID', 'TRANSACTION_COMPLETE', 'AML_FAILED', 'REPAYMENT', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('ACCEPT', 'PAYOUT');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETE', 'FAILED');

-- CreateEnum
CREATE TYPE "PocketStatus" AS ENUM ('NEW', 'USED');

-- CreateEnum
CREATE TYPE "AMLResult" AS ENUM ('CLEAN', 'DIRTY');

-- CreateTable
CREATE TABLE "Users" (
    "id" UUID NOT NULL,
    "email" TEXT,
    "telegram_id" TEXT NOT NULL,
    "telegram_username" TEXT NOT NULL,
    "phone_number" TEXT,
    "fullname" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JWT_tokens" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "fingerprint" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JWT_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bids" (
    "id" UUID NOT NULL,
    "from_user_id" UUID NOT NULL,
    "status" "BidStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "Bids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currencies" (
    "id" UUID NOT NULL,
    "fullname" TEXT NOT NULL,
    "shortname" TEXT NOT NULL,

    CONSTRAINT "Currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currency_blockchain_networks" (
    "id" UUID NOT NULL,
    "currency_id" UUID NOT NULL,
    "blockchain_network_id" UUID NOT NULL,

    CONSTRAINT "Currency_blockchain_networks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blockchain_networks" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Blockchain_networks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payments" (
    "id" UUID NOT NULL,
    "type" "PaymentType" NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "amount" DECIMAL NOT NULL,
    "bid_id" UUID NOT NULL,
    "currency_id" UUID NOT NULL,
    "pocket_id" UUID,
    "deadline" TIMESTAMP NOT NULL,
    "transaction_hash" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pockets" (
    "id" UUID NOT NULL,
    "blockchain_network_id" UUID NOT NULL,
    "address" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "seed_phrase" TEXT,
    "status" "PocketStatus" NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP,

    CONSTRAINT "Pockets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exchange_pairs" (
    "id" UUID NOT NULL,
    "from_currency_id" UUID NOT NULL,
    "to_currency_id" UUID NOT NULL,
    "markup_percentage" DECIMAL NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP,

    CONSTRAINT "Exchange_pairs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exchange_rates_history" (
    "id" UUID NOT NULL,
    "bid_id" UUID NOT NULL,
    "exchange_pair_id" UUID NOT NULL,
    "rate" DECIMAL NOT NULL,
    "markup_percentage" DECIMAL NOT NULL,
    "created_at" TIMESTAMP NOT NULL,

    CONSTRAINT "Exchange_rates_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AML_checks" (
    "id" UUID NOT NULL,
    "bid_id" UUID NOT NULL,
    "result" "AMLResult" NOT NULL,
    "source" TEXT,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP,

    CONSTRAINT "AML_checks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_telegram_id_key" ON "Users"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_telegram_username_key" ON "Users"("telegram_username");

-- CreateIndex
CREATE UNIQUE INDEX "JWT_tokens_refresh_token_key" ON "JWT_tokens"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "Currencies_fullname_key" ON "Currencies"("fullname");

-- CreateIndex
CREATE UNIQUE INDEX "Currencies_shortname_key" ON "Currencies"("shortname");

-- CreateIndex
CREATE UNIQUE INDEX "Pockets_address_key" ON "Pockets"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Pockets_publicKey_key" ON "Pockets"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "Pockets_privateKey_key" ON "Pockets"("privateKey");

-- CreateIndex
CREATE UNIQUE INDEX "Pockets_seed_phrase_key" ON "Pockets"("seed_phrase");

-- AddForeignKey
ALTER TABLE "JWT_tokens" ADD CONSTRAINT "JWT_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bids" ADD CONSTRAINT "Bids_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Currency_blockchain_networks" ADD CONSTRAINT "Currency_blockchain_networks_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "Currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Currency_blockchain_networks" ADD CONSTRAINT "Currency_blockchain_networks_blockchain_network_id_fkey" FOREIGN KEY ("blockchain_network_id") REFERENCES "Blockchain_networks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_bid_id_fkey" FOREIGN KEY ("bid_id") REFERENCES "Bids"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "Currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_pocket_id_fkey" FOREIGN KEY ("pocket_id") REFERENCES "Pockets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pockets" ADD CONSTRAINT "Pockets_blockchain_network_id_fkey" FOREIGN KEY ("blockchain_network_id") REFERENCES "Blockchain_networks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange_pairs" ADD CONSTRAINT "Exchange_pairs_from_currency_id_fkey" FOREIGN KEY ("from_currency_id") REFERENCES "Currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange_pairs" ADD CONSTRAINT "Exchange_pairs_to_currency_id_fkey" FOREIGN KEY ("to_currency_id") REFERENCES "Currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange_rates_history" ADD CONSTRAINT "Exchange_rates_history_bid_id_fkey" FOREIGN KEY ("bid_id") REFERENCES "Bids"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange_rates_history" ADD CONSTRAINT "Exchange_rates_history_exchange_pair_id_fkey" FOREIGN KEY ("exchange_pair_id") REFERENCES "Exchange_pairs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AML_checks" ADD CONSTRAINT "AML_checks_bid_id_fkey" FOREIGN KEY ("bid_id") REFERENCES "Bids"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
