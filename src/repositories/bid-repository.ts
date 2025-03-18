import { Prisma } from '@prisma/client'
import { BaseRepository } from './base-repository'
import { GetBidsQueryParamsInput } from '../schemas/bid-schema'

class BidRepository extends BaseRepository {
  async createBid(bid: Prisma.BidCreateInput) {
    try {
      return await this.prisma.bid.create({ data: bid })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async getBidById(id: string) {
    try {
      return await this.prisma.bid.findUnique({ where: { id } })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async getBids(params: GetBidsQueryParamsInput) {
    try {
      const {
        limit,
        offset,
        fromUserId,
        status,
        createdAtGte,
        createdAtLte,
        orderByCreatedAt,
        orderByStatus
      } = params

      const where = {
        fromUserId: fromUserId,
        status: { in: status },
        createdAt: {
          gte: createdAtGte,
          lte: createdAtLte
        }
      }

      const orderBy = { createdAt: orderByCreatedAt, status: orderByStatus }

      const [bids, count] = await Promise.all([
        this.prisma.bid.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy
        }),
        this.prisma.bid.count()
      ])

      return { bids, count }
    } catch (err) {
      this.handlePrismaError(err)
    }
  }

  async updateBid(id: string, bid: Prisma.BidUpdateInput) {
    try {
      return this.prisma.bid.update({ where: { id }, data: bid })
    } catch (err) {
      this.handlePrismaError(err)
    }
  }
}

export const bidRepository = new BidRepository()
