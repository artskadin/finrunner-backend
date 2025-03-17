import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { AuthMiddleware } from '../../middlewares/auth-middleware'
import {
  createExchangePairSchema,
  deleteExchangePairSchema,
  exchangePairSchema,
  exchangePairSchemaResponse,
  getExchangePairByIdSchema,
  updateExchangePairBodySchema,
  updateExchangePairParamsSchema
} from '../../schemas/exchange-pair-schema'
import { exchangePairController } from '../../controllers/exchange-pair-controller'

export function exchangePairRouter(
  app: FastifyInstance,
  opts: FastifyPluginOptions
) {
  app.addHook('preHandler', AuthMiddleware.authorizeRoles(['ADMIN']))

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        200: exchangePairSchemaResponse.array()
      }
    },
    handler: exchangePairController.getPairs.bind(exchangePairController)
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/:id',
    schema: {
      params: getExchangePairByIdSchema,
      response: {
        200: exchangePairSchemaResponse
      }
    },
    handler: exchangePairController.getPairById.bind(exchangePairController)
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/',
    schema: {
      body: createExchangePairSchema,
      response: {
        201: exchangePairSchemaResponse
      }
    },
    handler: exchangePairController.createPair.bind(exchangePairController)
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      params: updateExchangePairParamsSchema,
      body: updateExchangePairBodySchema,
      response: {
        200: exchangePairSchemaResponse
      }
    },
    handler: exchangePairController.updatePair.bind(exchangePairController)
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      params: deleteExchangePairSchema,
      response: {
        200: exchangePairSchema
      }
    },
    handler: exchangePairController.removePair.bind(exchangePairController)
  })
}
