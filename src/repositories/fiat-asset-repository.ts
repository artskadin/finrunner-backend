import { Prisma } from '@prisma/client'
import { BaseRepository } from './base-repository'

class FiatAssetRepository extends BaseRepository {
  constructor() {
    super()
  }

  async createFiatAsset(fiatAsset: Prisma.FiatAssetCreateInput) {
    try {
      return await this.prisma.fiatAsset.create({ data: fiatAsset })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async getFiatAssets() {
    try {
      return await this.prisma.fiatAsset.findMany({
        include: { currency: true, fiatProvider: true },
        orderBy: { createdAt: 'desc' }
      })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async getFiatAssetById(id: string) {
    try {
      return this.prisma.fiatAsset.findUnique({
        where: { id },
        include: { currency: true, fiatProvider: true }
      })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async deleteFiatAsset(id: string) {
    try {
      return await this.prisma.fiatAsset.delete({
        where: { id },
        include: { currency: true, fiatProvider: true }
      })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }
}

export const fiatAssetRepository = new FiatAssetRepository()
