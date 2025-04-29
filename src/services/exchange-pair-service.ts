import { Prisma } from '@prisma/client'
import { exchangePairsRepository } from '../repositories/exchange-pair-repository'
import { BaseService } from './base-service'
import { ExchangePairApiError } from '../exceptions/exchange-pair-api-error'

/**
 * Сервис для работы с обменными парами
 */
class ExchangePairService extends BaseService {
  async createPair(pair: Prisma.ExchangePairUncheckedCreateInput) {
    try {
      const {
        fromFiatAssetId,
        fromCryptoAssetId,
        toFiatAssetId,
        toCryptoAssetId,
        markupPercentage,
        status
      } = pair

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

      return await exchangePairsRepository.createPair(pair)
    } catch (err) {
      this.handleError(err)
    }
  }

  async getPairs() {
    try {
      return await exchangePairsRepository.getPairs()
    } catch (err) {
      this.handleError(err)
    }
  }

  async getPairById(id: string) {
    try {
      return await exchangePairsRepository.getPairById(id)
    } catch (err) {
      this.handleError(err)
    }
  }

  async updatePair(id: string, pair: Prisma.ExchangePairUncheckedUpdateInput) {
    try {
      return await exchangePairsRepository.updatePair(id, pair)
    } catch (err) {
      this.handleError(err)
    }
  }

  async removePair(id: string) {
    try {
      return await exchangePairsRepository.removePair(id)
    } catch (err) {
      this.handleError(err)
    }
  }
}

export const exchangePairsService = new ExchangePairService()
