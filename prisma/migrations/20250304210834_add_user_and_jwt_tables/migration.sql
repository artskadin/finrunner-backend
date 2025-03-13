-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'OPERATOR');

-- CreateTable
CREATE TABLE "Users" (
    "id" UUID NOT NULL,
    "email" TEXT,
    "telegram_id" BIGINT NOT NULL,
    "telegram_username" TEXT NOT NULL,
    "phone_number" TEXT,
    "fullname" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jwt_tokens" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "fingerprint" TEXT,

    CONSTRAINT "jwt_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_telegram_id_key" ON "Users"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_telegram_username_key" ON "Users"("telegram_username");

-- AddForeignKey
ALTER TABLE "jwt_tokens" ADD CONSTRAINT "jwt_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
