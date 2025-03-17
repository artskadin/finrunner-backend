import { Prisma } from '@prisma/client'
import { BaseRepository } from './base-repository'

class ExchangePairRepository extends BaseRepository {
  async createPair(pair: Prisma.ExchangePairCreateInput) {
    try {
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
      return await this.prisma.exchangePair.findMany()
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
      return await this.prisma.exchangePair.delete({ where: { id } })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }
}

export const exchangePairsRepository = new ExchangePairRepository()
