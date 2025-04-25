import { Prisma } from '@prisma/client'
import { BaseRepository } from './base-repository'

class CryptoAssetRepository extends BaseRepository {
  async createCryptoAsset(cryptoAsset: Prisma.CryptoAssetCreateInput) {
    try {
      return await this.prisma.cryptoAsset.create({ data: cryptoAsset })
    } catch (err) {
      this.handlePrismaError(err)

      throw new Error(`Failed to create crypto asset. Error: ${err}`)
    }
  }

  async getCryptoAssets() {
    try {
      return await this.prisma.cryptoAsset.findMany({
        include: { currency: true, blockchainNetwork: true },
        orderBy: { createdAt: 'desc' }
      })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async getCryptoAssetById(id: string) {
    try {
      return await this.prisma.cryptoAsset.findUnique({
        where: { id },
        include: { currency: true, blockchainNetwork: true }
      })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async updateCryptoAsset(
    id: string,
    cryptoAsset: Prisma.CryptoAssetUpdateInput
  ) {
    try {
      return await this.prisma.cryptoAsset.update({
        where: { id },
        data: cryptoAsset,
        include: { currency: true, blockchainNetwork: true }
      })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async deleteCryptoAsset(id: string) {
    try {
      return await this.prisma.cryptoAsset.delete({
        where: { id },
        include: { currency: true, blockchainNetwork: true }
      })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }
}

export const cryptoAssetRepository = new CryptoAssetRepository()
