import { Prisma } from '@prisma/client'
import { BaseRepository } from './base-repository'
import { GetCryptoWalletsQueryParamsInput } from '../schemas/crypto-wallet-schema'

class CryptoWalletRepository extends BaseRepository {
  async createWallet(payload: {
    wallet: Prisma.CryptoWalletCreateInput
    encryptionKeys: Prisma.CryptoWalletEncryptionKeyCreateWithoutCryptoWalletInput[]
  }) {
    try {
      const { wallet, encryptionKeys } = payload

      return this.prisma.cryptoWallet.create({
        data: { ...wallet, encryptionKey: { create: encryptionKeys } }
      })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async getWalletById(id: string) {
    try {
      return await this.prisma.cryptoWallet.findUnique({ where: { id } })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async getWallets(params: GetCryptoWalletsQueryParamsInput) {
    try {
      const {
        limit,
        offset,
        blockchainNetworkId,
        status,
        createdAtGte,
        createdAtLte,
        orderByCreatedAt
      } = params

      const where = {
        blockchainNetworkId,
        status: { in: status },
        createdAt: {
          gte: createdAtGte,
          lte: createdAtLte
        }
      }

      const orderBy = { createdAt: orderByCreatedAt }

      const [cryptoWallets, count] = await Promise.all([
        this.prisma.cryptoWallet.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy
        }),
        this.prisma.cryptoWallet.count()
      ])

      return { cryptoWallets, count }
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async updateWallet() {
    try {
    } catch (err) {
      this.handlePrismaError(err)
    }
  }
}

export const cryptoWalletRepository = new CryptoWalletRepository()
