import { Prisma } from '@prisma/client'
import { currencyRepository } from '../repositories/currency-repository'

class CurrencyService {
  async createCurrency(currency: Prisma.CurrencyCreateInput) {
    try {
      return await currencyRepository.createCurrency(currency)
    } catch (err) {
      throw err
    }
  }

  async getAllCurrencies() {
    try {
      return await currencyRepository.getAllCurrencies()
    } catch (err) {
      throw err
    }
  }

  async getCurrencyById(id: string) {
    try {
      return await currencyRepository.getCurrencyById(id)
    } catch (err) {
      throw err
    }
  }

  async updateCurrency(id: string, currency: Prisma.CurrencyUpdateInput) {
    try {
      return await currencyRepository.updateCurrency(id, currency)
    } catch (err) {
      throw err
    }
  }

  async removeCurrency(id: string) {
    try {
      return await currencyRepository.removeCurrency(id)
    } catch (err) {
      throw err
    }
  }
}

export const currencyService = new CurrencyService()
