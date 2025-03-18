import { FastifyRequest } from 'fastify'
import { FastifyReply } from 'fastify/types/reply'
import { bidService } from '../services/bid-service'
import {
  CreateBidInput,
  GetBidByIdInput,
  GetBidsQueryParamsInput,
  GetBidsResponseOutput,
  UpdateBidBodyInput
} from '../schemas/bid-schema'

class BidController {
  async createBid(
    req: FastifyRequest<{ Body: CreateBidInput }>,
    reply: FastifyReply
  ) {
    try {
      const { fromUserId } = req.body

      const createdBid = await bidService.createBid({ fromUserId })

      reply.status(201).send(createdBid)
    } catch (err) {
      throw err
    }
  }

  async getBids(
    req: FastifyRequest<{ Querystring: GetBidsQueryParamsInput }>,
    reply: FastifyReply
  ) {
    try {
      const query = req.query

      const result = await bidService.getBids(query)

      const response: GetBidsResponseOutput = {
        items: result?.bids || [],
        pagination: {
          limit: query.limit.toString(),
          offset: query.offset.toString(),
          total: result?.count.toString() || '0'
        },
        filters: {
          fromUserId: query.fromUserId,
          status: query.status,
          createdAtGte: query.createdAtGte,
          createdAtLte: query.createdAtLte
        },
        orderBy: {
          orderByCreatedAt: query.orderByCreatedAt,
          orderByStatus: query.orderByStatus
        }
      }

      reply.status(200).send(response)
    } catch (err) {
      throw err
    }
  }

  async getBidById(
    req: FastifyRequest<{ Params: GetBidByIdInput }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params

      const bid = await bidService.getBidById(id)

      reply.status(200).send(bid)
    } catch (err) {
      throw err
    }
  }

  async patchBid(
    req: FastifyRequest<{ Params: GetBidByIdInput; Body: UpdateBidBodyInput }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params
      const { status } = req.body

      const updatedBid = await bidService.updateBidStatus(id, status)

      reply.status(200).send(updatedBid)
    } catch (err) {
      throw err
    }
  }
}

export const bidController = new BidController()
