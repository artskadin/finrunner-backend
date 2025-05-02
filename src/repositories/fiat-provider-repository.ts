import { Prisma } from '@prisma/client'
import { BaseRepository } from './base-repository'

class FiatProviderRepository extends BaseRepository {
  constructor() {
    super()
  }

  async createFiatProvider(fiatProvider: Prisma.FiatProviderCreateInput) {
    try {
      return await this.prisma.fiatProvider.create({ data: fiatProvider })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async updateFiatProvier(
    id: string,
    fiatProvider: Prisma.FiatProviderUpdateInput
  ) {
    try {
      return await this.prisma.fiatProvider.update({
        where: { id },
        data: fiatProvider
      })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async getFiatProviderById(id: string) {
    try {
      return await this.prisma.fiatProvider.findUnique({ where: { id } })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async getFiatProviders() {
    try {
      return await this.prisma.fiatProvider.findMany()
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async deleteFiatProvider(id: string) {
    try {
      return await this.prisma.fiatProvider.delete({ where: { id } })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }
}

export const fiatProviderRepository = new FiatProviderRepository()
