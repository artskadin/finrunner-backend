import { Bid, Prisma } from '@prisma/client'
import { bidRepository } from '../repositories/bid-repository'
import { GetBidsQueryParamsInput } from '../schemas/bid-schema'
import { kafkaServie } from './kafka/kafka-service'
import { KafkaTopics } from './kafka/kafka-topics'
import { BaseService } from './base-service'
import Decimal from 'decimal.js'

/**
 * Сервис для работы с заявками
 */
class BidService extends BaseService {
  async createBid(bid: Prisma.BidUncheckedCreateInput) {
    try {
      const createdBid = await bidRepository.createBid({
        fromUser: { connect: { id: bid.fromUserId } }
      })

      if (createdBid) {
        kafkaServie.send(KafkaTopics.CryptoPaymentEvents, {
          type: 'CREATE_PAYMENT_EVENT',
          payload: {
            type: 'CRYPTO',
            target: 'ACCEPT',
            amount: new Decimal(1),
            deadline: new Date(),
            bidId: createdBid.id,
            currencyId: ''
          }
        })
      }

      if (createdBid) {
        kafkaServie.send(KafkaTopics.CryptoWalletEvents, {
          type: 'CREATE_WALLET_EVENT',
          payload: {
            blockchainNetworkId: '9f8d754a-4bd1-4463-b05b-ba0da5239c2c'
          }
        })
      }

      return createdBid
    } catch (err) {
      this.handleError(err)
    }
  }

  async getBidById(id: string) {
    try {
      return await bidRepository.getBidById(id)
    } catch (err) {
      this.handleError(err)
    }
  }

  async getBids(params: GetBidsQueryParamsInput) {
    try {
      return await bidRepository.getBids(params)
    } catch (err) {
      this.handleError(err)
    }
  }

  async updateBidStatus(id: string, status: Bid['status']) {
    try {
      return await bidRepository.updateBid(id, { status })
    } catch (err) {
      this.handleError(err)
    }
  }
}

export const bidService = new BidService()
