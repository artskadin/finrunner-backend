import { ExchangePairStatus, Prisma } from '@prisma/client'
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
      return await this.prisma.exchangePair.findUnique({
        where: { id },
        include: {
          fromCryptoAsset: {
            include: { currency: true, blockchainNetwork: true }
          },
          fromFiatAsset: {
            include: { currency: true, fiatProvider: true }
          },
          toCryptoAsset: {
            include: { currency: true, blockchainNetwork: true }
          },
          toFiatAsset: {
            include: { currency: true, fiatProvider: true }
          }
        }
      })
    } catch (err) {
      this.handlePrismaError(err, id)
    }
  }

  async getPairs(filters?: { status: ExchangePairStatus[] }) {
    try {
      return await this.prisma.exchangePair.findMany({
        where: {
          ...(filters?.status && { status: { in: filters.status } })
        },
        include: {
          fromCryptoAsset: {
            include: { currency: true, blockchainNetwork: true }
          },
          fromFiatAsset: {
            include: { currency: true, fiatProvider: true }
          },
          toCryptoAsset: {
            include: { currency: true, blockchainNetwork: true }
          },
          toFiatAsset: {
            include: { currency: true, fiatProvider: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async findPairByAssetIds({
    fromAssetId,
    fromAssetType,
    toAssetId,
    toAssetType
  }: {
    fromAssetId: string
    toAssetId: string
    fromAssetType: 'crypto' | 'fiat'
    toAssetType: 'crypto' | 'fiat'
  }) {
    try {
      const whereClause: Prisma.ExchangePairWhereInput = {}

      fromAssetType === 'crypto'
        ? (whereClause.fromCryptoAssetId = fromAssetId)
        : (whereClause.fromFiatAssetId = fromAssetId)
      toAssetType === 'crypto'
        ? (whereClause.toCryptoAssetId = toAssetId)
        : (whereClause.toFiatAssetId = toAssetId)

      return await this.prisma.exchangePair.findFirst({
        where: whereClause,
        include: {
          fromCryptoAsset: {
            include: { currency: true, blockchainNetwork: true }
          },
          fromFiatAsset: {
            include: { currency: true, fiatProvider: true }
          },
          toCryptoAsset: {
            include: { currency: true, blockchainNetwork: true }
          },
          toFiatAsset: {
            include: { currency: true, fiatProvider: true }
          }
        }
      })
    } catch (err) {
      throw this.handlePrismaError(err)
    }
  }

  async findAvailableToAssetIds({
    fromAssetId,
    fromAssetType
  }: {
    fromAssetId: string
    fromAssetType: 'crypto' | 'fiat'
  }): Promise<{ crypto: string[]; fiat: string[] }> {
    try {
      const whereClause: Prisma.ExchangePairWhereInput = { status: 'ACTIVE' }

      fromAssetType === 'crypto'
        ? (whereClause.fromCryptoAssetId = fromAssetId)
        : (whereClause.fromFiatAssetId = fromAssetId)

      const pairs = await this.prisma.exchangePair.findMany({
        where: whereClause,
        select: {
          toCryptoAssetId: true,
          toFiatAssetId: true
        }
      })

      const cryptoIds = pairs
        .map((p) => p.toCryptoAssetId)
        .filter((id): id is string => !!id)
      const fiatIds = pairs
        .map((p) => p.toFiatAssetId)
        .filter((id): id is string => !!id)

      return { crypto: cryptoIds, fiat: fiatIds }
    } catch (err) {
      throw this.handlePrismaError(err)
    }
  }

  async findAvailableFromAssetIds({
    toAssetId,
    toAssetType
  }: {
    toAssetId: string
    toAssetType: 'crypto' | 'fiat'
  }): Promise<{ crypto: string[]; fiat: string[] }> {
    try {
      const whereClause: Prisma.ExchangePairWhereInput = { status: 'ACTIVE' }

      toAssetType === 'crypto'
        ? (whereClause.toCryptoAssetId = toAssetId)
        : (whereClause.toFiatAssetId = toAssetId)

      const pairs = await this.prisma.exchangePair.findMany({
        where: whereClause,
        select: {
          fromCryptoAssetId: true,
          fromFiatAssetId: true
        }
      })

      const cryptoIds = pairs
        .map((p) => p.fromCryptoAssetId)
        .filter((id): id is string => !!id)
      const fiatIds = pairs
        .map((p) => p.fromFiatAssetId)
        .filter((id): id is string => !!id)

      return { crypto: cryptoIds, fiat: fiatIds }
    } catch (err) {
      throw this.handlePrismaError(err)
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
