import {
  FastifyInstance,
  FastifyPluginOptions,
  HookHandlerDoneFunction
} from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { AuthMiddleware } from '../../middlewares/auth-middleware'
import { bidController } from '../../controllers/bid-controller'
import {
  bidQueryParamsSchema,
  bidSchema,
  createBidSchema,
  getBidByIdSchema,
  getBidsResponseSchema,
  updateBidBodySchema
} from '../../schemas/bid-schema'
import {
  apiErrorResponseSchema,
  internalServerErrorResponseSchema
} from '../../schemas/api-error-schema'

export function bidRouter(
  app: FastifyInstance,
  opts: FastifyPluginOptions,
  done: HookHandlerDoneFunction
) {
  app.addHook(
    'preHandler',
    AuthMiddleware.authorizeRoles(['ADMIN', 'OPERATOR'])
  )

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
      description: 'Get all bids',
      tags: ['Bids'],
      querystring: bidQueryParamsSchema,
      response: {
        200: getBidsResponseSchema,
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: bidController.getBids
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/:id',
    schema: {
      description: 'Get bid by id',
      tags: ['Bids'],
      params: getBidByIdSchema,
      response: {
        200: bidSchema,
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: bidController.getBidById
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/',
    schema: {
      description: 'Create bid',
      tags: ['Bids'],
      body: createBidSchema,
      response: {
        201: bidSchema,
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: bidController.createBid
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      description: 'Patch bid',
      tags: ['Bids'],
      params: getBidByIdSchema,
      body: updateBidBodySchema,
      response: {
        200: bidSchema,
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: bidController.patchBid
  })

  done()
}
