import { Prisma } from '@prisma/client'
import { exchangePairsRepository } from '../repositories/exchange-pair-repository'

class ExchangePairService {
  async createPair(pair: Prisma.ExchangePairUncheckedCreateInput) {
    try {
      const { fromCurrencyId, toCurrencyId, markupPercentage } = pair

      return await exchangePairsRepository.createPair({
        fromCurrency: { connect: { id: fromCurrencyId } },
        toCurrency: { connect: { id: toCurrencyId } },
        markupPercentage
      })
    } catch (err) {
      throw err
    }
  }

  async getPairs() {
    try {
      return await exchangePairsRepository.getPairs()
    } catch (err) {
      throw err
    }
  }

  async getPairById(id: string) {
    try {
      return await exchangePairsRepository.getPairById(id)
    } catch (err) {
      throw err
    }
  }

  async updatePair(id: string, pair: Prisma.ExchangePairUncheckedUpdateInput) {
    try {
      return await exchangePairsRepository.updatePair(id, pair)
    } catch (err) {
      throw err
    }
  }

  async removePair(id: string) {
    try {
      return await exchangePairsRepository.removePair(id)
    } catch (err) {
      throw err
    }
  }
}

export const exchangePairsService = new ExchangePairService()
