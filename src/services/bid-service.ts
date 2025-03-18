import { Bid, Prisma } from '@prisma/client'
import { bidRepository } from '../repositories/bid-repository'
import { GetBidsQueryParamsInput } from '../schemas/bid-schema'

class BidService {
  async createBid(bid: Prisma.BidUncheckedCreateInput) {
    try {
      return await bidRepository.createBid({
        fromUser: { connect: { id: bid.fromUserId } }
      })
    } catch (err) {
      throw err
    }
  }

  async getBidById(id: string) {
    try {
      return await bidRepository.getBidById(id)
    } catch (err) {
      throw err
    }
  }

  async getBids(params: GetBidsQueryParamsInput) {
    try {
      return await bidRepository.getBids(params)
    } catch (err) {
      throw err
    }
  }

  async updateBidStatus(id: string, status: Bid['status']) {
    try {
      return await bidRepository.updateBid(id, { status })
    } catch (err) {
      throw err
    }
  }
}

export const bidService = new BidService()
