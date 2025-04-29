import { Prisma } from '@prisma/client'
import { BaseRepository } from './base-repository'
import { ApiError } from '../exceptions/api-error'

class ExchangePairRepository extends BaseRepository {
  async createPair(pair: Prisma.ExchangePairUncheckedCreateInput) {
    try {
      const existingPair = await this.prisma.exchangePair.findFirst({
        where: {
          fromCryptoAssetId: pair.fromCryptoAssetId ?? null,
          toCryptoAssetId: pair.toCryptoAssetId ?? null,
          fromFiatAssetId: pair.fromFiatAssetId ?? null,
          toFiatAssetId: pair.toFiatAssetId ?? null
        }
      })

      if (existingPair) {
        throw ApiError.EntityAlreadyExist('ExchangePair', 'assetId')
      }

      return await this.prisma.exchangePair.create({ data: pair })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async getPairById(id: string) {
    try {
      return await this.prisma.exchangePair.findUnique({ where: { id } })
    } catch (err) {
      this.handlePrismaError(err, id)
    }
  }

  async getPairs() {
    try {
      return await this.prisma.exchangePair.findMany({
        include: {
          fromCryptoAsset: {
            include: { currency: true, blockchainNetwork: true }
          },
          fromFiatAsset: true,
          toCryptoAsset: {
            include: { currency: true, blockchainNetwork: true }
          },
          toFiatAsset: true
        },
        orderBy: { createdAt: 'desc' }
      })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async updatePair(id: string, pair: Prisma.ExchangePairUpdateInput) {
    try {
      return await this.prisma.exchangePair.update({
        where: { id },
        data: pair
      })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async removePair(id: string) {
    try {
      return await this.prisma.exchangePair.update({
        where: { id },
        data: { status: 'ARCHIVED' }
      })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }
}

export const exchangePairsRepository = new ExchangePairRepository()
