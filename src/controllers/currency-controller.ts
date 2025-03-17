import { FastifyRequest, FastifyReply } from 'fastify'
import {
  CreateCurrencyInput,
  DeleteCurrencyInput,
  GetCurrencyByIdInput,
  UpdateCurrencyBodyInput,
  UpdateCurrencyParamsInput
} from '../schemas/currency-schema'
import { currencyService } from '../services/currency-service'

class CurrencyController {
  async createCurrency(
    req: FastifyRequest<{ Body: CreateCurrencyInput }>,
    reply: FastifyReply
  ) {
    try {
      const { fullname, shortname } = req.body

      const createdCurrency = await currencyService.createCurrency({
        fullname,
        shortname
      })

      reply.status(201).send(createdCurrency)
    } catch (err) {
      throw err
    }
  }

  async getAllCurrencies(req: FastifyRequest, reply: FastifyReply) {
    try {
      const currencies = await currencyService.getAllCurrencies()

      reply.status(200).send(currencies)
    } catch (err) {
      throw err
    }
  }

  async getCurrencyById(
    req: FastifyRequest<{ Params: GetCurrencyByIdInput }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params

      const currency = await currencyService.getCurrencyById(id)

      reply.status(200).send(currency)
    } catch (err) {
      throw err
    }
  }

  async updateCurrency(
    req: FastifyRequest<{
      Params: UpdateCurrencyParamsInput
      Body: UpdateCurrencyBodyInput
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params
      const { fullname, shortname } = req.body

      const updatedCurrency = await currencyService.updateCurrency(id, {
        fullname,
        shortname
      })

      reply.status(200).send(updatedCurrency)
    } catch (err) {
      throw err
    }
  }

  async removeCurrency(
    req: FastifyRequest<{ Params: DeleteCurrencyInput }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params

      const removedCurrency = await currencyService.removeCurrency(id)

      reply.status(200).send(removedCurrency)
    } catch (err) {
      throw err
    }
  }
}

export const currencyController = new CurrencyController()
