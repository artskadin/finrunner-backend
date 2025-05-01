import { FastifyReply, FastifyRequest } from 'fastify'
import { ExchangePair } from '@prisma/client'
import {
  CreateExchangePairInput,
  DeleteExchangePairInput,
  GetExchangePairByIdInput,
  UpdateExchangePairBodyInput,
  UpdateExchangePairParamsInput
} from '../schemas/exchange-pair-schema'
import { exchangePairsService } from '../services/exchange-pair-service'
import { ExchangePairApiError } from '../exceptions/exchange-pair-api-error'

class ExchangePairController {
  private preparePairToResponse(pair: ExchangePair) {
    return {
      ...pair,
      markupPercentage: pair.markupPercentage.toString(),
      minAmount: pair.minAmount.toString(),
      maxAmount: pair.maxAmount.toString()
    }
  }

  createPair = async (
    req: FastifyRequest<{ Body: CreateExchangePairInput }>,
    reply: FastifyReply
  ) => {
    try {
      const {
        fromFiatAssetId,
        fromCryptoAssetId,
        toFiatAssetId,
        toCryptoAssetId,
        status,
        markupPercentage
      } = req.body

      if (
        (!fromFiatAssetId && !fromCryptoAssetId) ||
        (fromFiatAssetId && fromCryptoAssetId)
      ) {
        throw ExchangePairApiError.OnlyFromCryptoOrFromFiat()
      }

      if (
        (!toFiatAssetId && !toCryptoAssetId) ||
        (toFiatAssetId && toCryptoAssetId)
      ) {
        throw ExchangePairApiError.OnlyToCryptoOrToFiat()
      }

      const createdPair = await exchangePairsService.createPair({
        fromFiatAssetId,
        fromCryptoAssetId,
        toFiatAssetId,
        toCryptoAssetId,
        status,
        markupPercentage
      })

      if (createdPair) {
        const responseData = this.preparePairToResponse(createdPair)

        reply.status(201).send(responseData)
      }
    } catch (err) {
      throw err
    }
  }

  async getPairs(req: FastifyRequest, reply: FastifyReply) {
    try {
      const pairs = await exchangePairsService.getPairs()

      if (pairs) {
        const responseData = pairs.map((pair) =>
          this.preparePairToResponse(pair)
        )

        reply.status(200).send(responseData)
      }
    } catch (err) {
      throw err
    }
  }

  async getPairById(
    req: FastifyRequest<{ Params: GetExchangePairByIdInput }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params

      const pair = await exchangePairsService.getPairById(id)

      if (pair) {
        const responseData = this.preparePairToResponse(pair)

        reply.status(200).send(responseData)
      }
    } catch (err) {
      throw err
    }
  }

  async updatePair(
    req: FastifyRequest<{
      Params: UpdateExchangePairParamsInput
      Body: UpdateExchangePairBodyInput
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params
      const { status, markupPercentage } = req.body

      const updatedPair = await exchangePairsService.updatePair(id, {
        status,
        markupPercentage
      })

      if (updatedPair) {
        const responseData = this.preparePairToResponse(updatedPair)

        reply.status(200).send(responseData)
      }
    } catch (err) {
      throw err
    }
  }

  removePair = async (
    req: FastifyRequest<{ Params: DeleteExchangePairInput }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = req.params

      const removedPair = await exchangePairsService.removePair(id)

      if (removedPair) {
        const responseData = this.preparePairToResponse(removedPair)

        reply.status(200).send(responseData)
      }
    } catch (err) {
      throw err
    }
  }
}

export const exchangePairController = new ExchangePairController()
