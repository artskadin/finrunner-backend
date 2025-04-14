import {
  FastifyPluginOptions,
  FastifyInstance,
  HookHandlerDoneFunction
} from 'fastify'
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
import {
  apiErrorResponseSchema,
  internalServerErrorResponseSchema
} from '../../schemas/api-error-schema'

export function currencyRouter(
  app: FastifyInstance,
  opts: FastifyPluginOptions,
  done: HookHandlerDoneFunction
) {
  app.addHook('preHandler', AuthMiddleware.authenticate)
  app.addHook(
    'preHandler',
    AuthMiddleware.authorizeRoles(['ADMIN', 'OPERATOR'])
  )

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
      description: 'Get all available currencies',
      tags: ['Currencies'],
      response: {
        200: currencySchema.array(),
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: currencyController.getCurrencies
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/:id',
    schema: {
      description: 'Get currency by id',
      tags: ['Currencies'],
      params: getCurrencyByIdSchema,
      response: {
        200: currencySchema,
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: currencyController.getCurrencyById
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/',
    schema: {
      description: 'Create currency',
      tags: ['Currencies'],
      body: createCurrencySchema,
      response: {
        201: currencySchema,
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: currencyController.createCurrency
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PUT',
    url: '/:id',
    schema: {
      description: 'Update currency',
      tags: ['Currencies'],
      params: updateCurrencyParamsSchema,
      body: updateCurrencyBodySchema,
      response: {
        200: currencySchema,
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: currencyController.updateCurrency
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      description: 'Delete currency',
      tags: ['Currencies'],
      params: deleteCurrencySchema,
      response: {
        200: currencySchema
      }
    },
    handler: currencyController.removeCurrency
  })

  done()
}
