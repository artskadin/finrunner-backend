import { FastifyInstance, FastifyPluginOptions } from 'fastify'
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

export function bidRouter(app: FastifyInstance, opts: FastifyPluginOptions) {
  app.addHook(
    'preHandler',
    AuthMiddleware.authorizeRoles(['ADMIN', 'OPERATOR'])
  )

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
      querystring: bidQueryParamsSchema,
      response: {
        200: getBidsResponseSchema
      }
    },
    handler: bidController.getBids
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/:id',
    schema: {
      params: getBidByIdSchema,
      response: {
        200: bidSchema
      }
    },
    handler: bidController.getBidById
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/',
    schema: {
      body: createBidSchema,
      response: {
        201: bidSchema
      }
    },
    handler: bidController.createBid
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      params: getBidByIdSchema,
      body: updateBidBodySchema,
      response: {
        200: bidSchema
      }
    },
    handler: bidController.patchBid
  })
}
