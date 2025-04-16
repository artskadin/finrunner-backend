-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'OPERATOR');

-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('DRAFT', 'PAYMENT', 'UNPAID', 'TRANSACTION_COMPLETE', 'AML_FAILED', 'REPAYMENT', 'COMPLETED');

-- CreateEnum
CREATE TYPE "FiatProviderType" AS ENUM ('BANK', 'PAYMENT_SYSTEM', 'PHONE_NUMBER');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CRYPTO', 'FIAT');

-- CreateEnum
CREATE TYPE "PaymentTarget" AS ENUM ('ACCEPT', 'PAYOUT');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "WalletStatus" AS ENUM ('NEW', 'USED');

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
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

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
    "token_standart" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Blockchain_networks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fiat_providers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FiatProviderType" NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "Fiat_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fiat_provider_currencies" (
    "id" UUID NOT NULL,
    "fiat_provider_id" UUID NOT NULL,
    "currency_id" UUID NOT NULL,

    CONSTRAINT "Fiat_provider_currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payments" (
    "id" UUID NOT NULL,
    "type" "PaymentType" NOT NULL,
    "target" "PaymentTarget" NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "amount" DECIMAL NOT NULL,
    "bid_id" UUID NOT NULL,
    "currency_id" UUID NOT NULL,
    "crypto_wallet_id" UUID,
    "deadline" TIMESTAMP NOT NULL,
    "transaction_hash" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fiat_payment_details" (
    "id" UUID NOT NULL,
    "payment_id" UUID NOT NULL,
    "cart_number" TEXT,
    "cart_holder" TEXT,
    "phone_number" TEXT,
    "crypto_wallet_address" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "Fiat_payment_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crypto_wallets" (
    "id" UUID NOT NULL,
    "blockchain_network_id" UUID NOT NULL,
    "address" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "seed_phrase" TEXT,
    "status" "WalletStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "Crypto_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exchange_pairs" (
    "id" UUID NOT NULL,
    "from_currency_id" UUID NOT NULL,
    "to_currency_id" UUID NOT NULL,
    "markup_percentage" DECIMAL NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,
    "from_crypto_unit_id" UUID,
    "to_crypto_unit_id" UUID,
    "from_fiat_unit_id" UUID,
    "to_fiat_unit_id" UUID,

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
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "AML_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crypto_wallet_encryption_keys" (
    "id" UUID NOT NULL,
    "crypto_wallet_id" UUID NOT NULL,
    "iv" TEXT NOT NULL,
    "field_name" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Crypto_wallet_encryption_keys_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Currency_blockchain_networks_currency_id_blockchain_network_key" ON "Currency_blockchain_networks"("currency_id", "blockchain_network_id");

-- CreateIndex
CREATE UNIQUE INDEX "blockchain_networks_name_token_standart_key" ON "Blockchain_networks"("name", "token_standart");

-- CreateIndex
CREATE UNIQUE INDEX "Fiat_provider_currencies_fiat_provider_id_currency_id_key" ON "Fiat_provider_currencies"("fiat_provider_id", "currency_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payments_crypto_wallet_id_key" ON "Payments"("crypto_wallet_id");

-- CreateIndex
CREATE UNIQUE INDEX "Fiat_payment_details_payment_id_key" ON "Fiat_payment_details"("payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "Crypto_wallets_address_key" ON "Crypto_wallets"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Crypto_wallets_publicKey_key" ON "Crypto_wallets"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "Crypto_wallets_privateKey_key" ON "Crypto_wallets"("privateKey");

-- CreateIndex
CREATE UNIQUE INDEX "Crypto_wallets_seed_phrase_key" ON "Crypto_wallets"("seed_phrase");

-- CreateIndex
CREATE UNIQUE INDEX "Exchange_pairs_from_crypto_unit_id_to_crypto_unit_id_from_f_key" ON "Exchange_pairs"("from_crypto_unit_id", "to_crypto_unit_id", "from_fiat_unit_id", "to_fiat_unit_id");

-- AddForeignKey
ALTER TABLE "JWT_tokens" ADD CONSTRAINT "JWT_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bids" ADD CONSTRAINT "Bids_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Currency_blockchain_networks" ADD CONSTRAINT "Currency_blockchain_networks_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "Currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Currency_blockchain_networks" ADD CONSTRAINT "Currency_blockchain_networks_blockchain_network_id_fkey" FOREIGN KEY ("blockchain_network_id") REFERENCES "Blockchain_networks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fiat_provider_currencies" ADD CONSTRAINT "Fiat_provider_currencies_fiat_provider_id_fkey" FOREIGN KEY ("fiat_provider_id") REFERENCES "Fiat_providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fiat_provider_currencies" ADD CONSTRAINT "Fiat_provider_currencies_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "Currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_bid_id_fkey" FOREIGN KEY ("bid_id") REFERENCES "Bids"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "Currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_crypto_wallet_id_fkey" FOREIGN KEY ("crypto_wallet_id") REFERENCES "Crypto_wallets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fiat_payment_details" ADD CONSTRAINT "Fiat_payment_details_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "Payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crypto_wallets" ADD CONSTRAINT "Crypto_wallets_blockchain_network_id_fkey" FOREIGN KEY ("blockchain_network_id") REFERENCES "Blockchain_networks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange_pairs" ADD CONSTRAINT "Exchange_pairs_from_crypto_unit_id_fkey" FOREIGN KEY ("from_crypto_unit_id") REFERENCES "Currency_blockchain_networks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange_pairs" ADD CONSTRAINT "Exchange_pairs_to_crypto_unit_id_fkey" FOREIGN KEY ("to_crypto_unit_id") REFERENCES "Currency_blockchain_networks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange_pairs" ADD CONSTRAINT "Exchange_pairs_from_fiat_unit_id_fkey" FOREIGN KEY ("from_fiat_unit_id") REFERENCES "Fiat_provider_currencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange_pairs" ADD CONSTRAINT "Exchange_pairs_to_fiat_unit_id_fkey" FOREIGN KEY ("to_fiat_unit_id") REFERENCES "Fiat_provider_currencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange_rates_history" ADD CONSTRAINT "Exchange_rates_history_bid_id_fkey" FOREIGN KEY ("bid_id") REFERENCES "Bids"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange_rates_history" ADD CONSTRAINT "Exchange_rates_history_exchange_pair_id_fkey" FOREIGN KEY ("exchange_pair_id") REFERENCES "Exchange_pairs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AML_checks" ADD CONSTRAINT "AML_checks_bid_id_fkey" FOREIGN KEY ("bid_id") REFERENCES "Bids"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crypto_wallet_encryption_keys" ADD CONSTRAINT "Crypto_wallet_encryption_keys_crypto_wallet_id_fkey" FOREIGN KEY ("crypto_wallet_id") REFERENCES "Crypto_wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
