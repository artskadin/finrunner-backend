import { Prisma } from '@prisma/client'
import { BaseRepository } from './base-repository'

class CurrencyRepository extends BaseRepository {
  async createCurrency(currency: Prisma.CurrencyCreateInput) {
    try {
      return await this.prisma.currency.create({ data: currency })
    } catch (err) {
      this.handlePrismaError(err)

      throw new Error(
        `Failed to create currency ${currency.fullname}. Error: ${err}`
      )
    }
  }

  async getAllCurrencies() {
    try {
      return await this.prisma.currency.findMany()
    } catch (err) {
      throw new Error(`Failed to get all currencies`)
    }
  }

  async getCurrencyById(id: string) {
    try {
      return await this.prisma.currency.findUnique({ where: { id } })
    } catch (err) {
      this.handlePrismaError(err, id)

      throw new Error(`Failed to get currency with id ${id}. Error: ${err}`)
    }
  }

  async updateCurrency(id: string, currency: Prisma.CurrencyUpdateInput) {
    try {
      return await this.prisma.currency.update({
        where: { id },
        data: currency
      })
    } catch (err) {
      this.handlePrismaError(err, id)

      throw new Error(
        `Failed to update currency ${currency.fullname}. Error: ${err}`
      )
    }
  }

  async removeCurrency(id: string) {
    try {
      return await this.prisma.currency.delete({ where: { id } })
    } catch (err) {
      this.handlePrismaError(err, id)

      throw new Error(`Failed to delete currency with id ${id}. Error: ${err}`)
    }
  }
}

export const currencyRepository = new CurrencyRepository()
