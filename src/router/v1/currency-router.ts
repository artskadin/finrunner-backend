import { FastifyPluginOptions, FastifyInstance } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider
} from 'fastify-type-provider-zod'
import {
  createCurrencySchema,
  currencySchema,
  deleteCurrencySchema,
  getCurrencyByIdSchema,
  updateCurrencyBodySchema,
  updateCurrencyParamsSchema
} from '../../schemas/currency-schema'
import { currencyController } from '../../controllers/currency-controller'
import { AuthMiddleware } from '../../middlewares/auth-middleware'

export function currencyRouter(
  app: FastifyInstance,
  opts: FastifyPluginOptions
) {
  app.addHook('preHandler', AuthMiddleware.authorizeRoles(['ADMIN']))

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        200: currencySchema.array()
      }
    },
    handler: currencyController.getCurrencies
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/:id',
    schema: {
      params: getCurrencyByIdSchema,
      response: {
        200: currencySchema
      }
    },
    handler: currencyController.getCurrencyById
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/',
    schema: {
      body: createCurrencySchema,
      response: {
        201: currencySchema
      }
    },
    handler: currencyController.createCurrency
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PUT',
    url: '/:id',
    schema: {
      params: updateCurrencyParamsSchema,
      body: updateCurrencyBodySchema,
      response: {
        200: currencySchema
      }
    },
    handler: currencyController.updateCurrency
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      params: deleteCurrencySchema
    },
    handler: currencyController.removeCurrency
  })
}
