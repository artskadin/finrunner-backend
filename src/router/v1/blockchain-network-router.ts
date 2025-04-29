import {
  FastifyInstance,
  FastifyPluginOptions,
  HookHandlerDoneFunction
} from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { blockchainNetworkController } from '../../controllers/blockchain-network-controller'
import { AuthMiddleware } from '../../middlewares/auth-middleware'
import {
  availableBlockchainNetworksSchema,
  blockchainNetworkSchema,
  createBlockchainNetworkSchema,
  deleteBlockchainNetworkParamsSchema,
  getblockchainNetworkByIdSchema,
  updateBlockchainNetworkBodySchema,
  updateBlockchainNetworkParamsSchema
} from '../../schemas/blockchain-network-schema'
import {
  apiErrorResponseSchema,
  internalServerErrorResponseSchema
} from '../../schemas/api-error-schema'

export function blockchainNetworkRouter(
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
    url: '/available',
    schema: {
      description:
        'Get list of blockchain networks that the backend can work with',
      tags: ['Blockchain networks'],
      response: {
        200: availableBlockchainNetworksSchema.nullable(),
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: blockchainNetworkController.getAvailableBlockchaiNetworks
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
      description: 'Get all availabe blockchain networks',
      tags: ['Blockchain networks'],
      response: {
        200: blockchainNetworkSchema.array().nullable(),
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: blockchainNetworkController.getNetworks
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/:id',
    schema: {
      description: 'Get blockchain network by id',
      tags: ['Blockchain networks'],
      params: getblockchainNetworkByIdSchema,
      response: {
        200: blockchainNetworkSchema.nullable(),
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: blockchainNetworkController.getNetworkById
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/',
    schema: {
      description: 'Create blockchain networks',
      tags: ['Blockchain networks'],
      body: createBlockchainNetworkSchema,
      response: {
        201: blockchainNetworkSchema,
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: blockchainNetworkController.createNetwork,
    preHandler: AuthMiddleware.authorizeRoles(['ADMIN'])
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      description: 'Patch blockchain networks',
      tags: ['Blockchain networks'],
      params: updateBlockchainNetworkParamsSchema,
      body: updateBlockchainNetworkBodySchema,
      response: {
        200: blockchainNetworkSchema,
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: blockchainNetworkController.updateNetwork,
    preHandler: AuthMiddleware.authorizeRoles(['ADMIN'])
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      description: 'Delete blockchain networks',
      tags: ['Blockchain networks'],
      params: deleteBlockchainNetworkParamsSchema,
      response: {
        200: blockchainNetworkSchema,
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: blockchainNetworkController.removeNetwork,
    preHandler: AuthMiddleware.authorizeRoles(['ADMIN'])
  })

  done()
}
