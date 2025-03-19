import { Prisma } from '@prisma/client'
import { BaseRepository } from './base-repository'

class CryptoWalletEncryptionKeyRepository extends BaseRepository {
  async createKey(key: Prisma.CryptoWalletEncryptionKeyCreateInput) {
    try {
      return await this.prisma.cryptoWalletEncryptionKey.create({ data: key })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async getKeyById(id: string) {
    try {
      return await this.prisma.cryptoWalletEncryptionKey.findUnique({
        where: { id }
      })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async getKeysByCryptoWalletId(cryptoWalletId: string) {
    try {
      return await this.prisma.cryptoWalletEncryptionKey.findMany({
        where: { cryptoWalletId }
      })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }
}

export const cryptoWalletEncryptionKeyRepository =
  new CryptoWalletEncryptionKeyRepository()
