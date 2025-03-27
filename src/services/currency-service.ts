import { Prisma } from '@prisma/client'
import { currencyRepository } from '../repositories/currency-repository'
import { BaseService } from './base-service'

/**
 * Сервис для работы с разными валютами
 */
class CurrencyService extends BaseService {
  async createCurrency(currency: Prisma.CurrencyCreateInput) {
    try {
      return await currencyRepository.createCurrency(currency)
    } catch (err) {
      this.handleError(err)
    }
  }

  async getAllCurrencies() {
    try {
      return await currencyRepository.getAllCurrencies()
    } catch (err) {
      this.handleError(err)
    }
  }

  async getCurrencyById(id: string) {
    try {
      return await currencyRepository.getCurrencyById(id)
    } catch (err) {
      this.handleError(err)
    }
  }

  async updateCurrency(id: string, currency: Prisma.CurrencyUpdateInput) {
    try {
      return await currencyRepository.updateCurrency(id, currency)
    } catch (err) {
      this.handleError(err)
    }
  }

  async removeCurrency(id: string) {
    try {
      return await currencyRepository.removeCurrency(id)
    } catch (err) {
      this.handleError(err)
    }
  }
}

export const currencyService = new CurrencyService()
