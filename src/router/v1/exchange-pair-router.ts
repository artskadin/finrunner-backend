import {
  FastifyInstance,
  FastifyPluginOptions,
  HookHandlerDoneFunction
} from 'fastify'
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
import {
  apiErrorResponseSchema,
  internalServerErrorResponseSchema
} from '../../schemas/api-error-schema'

export function exchangePairRouter(
  app: FastifyInstance,
  opts: FastifyPluginOptions,
  done: HookHandlerDoneFunction
) {
  app.addHook('preHandler', AuthMiddleware.authenticate)
  app.addHook('preHandler', AuthMiddleware.authorizeRoles(['ADMIN']))

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
      description: 'Get all available exchange pairs',
      tags: ['Exchange pairs'],
      response: {
        200: exchangePairSchemaResponse.array(),
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: exchangePairController.getPairs.bind(exchangePairController)
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/:id',
    schema: {
      description: 'Get exchange pair by id',
      tags: ['Exchange pairs'],
      params: getExchangePairByIdSchema,
      response: {
        200: exchangePairSchemaResponse,
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: exchangePairController.getPairById.bind(exchangePairController)
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/',
    schema: {
      description: 'Create exchange pair',
      tags: ['Exchange pairs'],
      body: createExchangePairSchema,
      response: {
        201: exchangePairSchemaResponse,
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: exchangePairController.createPair.bind(exchangePairController)
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      description: 'Patch exchange pair',
      tags: ['Exchange pairs'],
      params: updateExchangePairParamsSchema,
      body: updateExchangePairBodySchema,
      response: {
        200: exchangePairSchemaResponse,
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: exchangePairController.updatePair.bind(exchangePairController)
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      description: 'Delete exchange pair',
      tags: ['Exchange pairs'],
      params: deleteExchangePairSchema,
      response: {
        200: exchangePairSchema,
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: exchangePairController.removePair.bind(exchangePairController)
  })

  done()
}
