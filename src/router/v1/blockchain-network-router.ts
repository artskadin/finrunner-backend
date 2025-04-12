import {
  FastifyInstance,
  FastifyPluginOptions,
  HookHandlerDoneFunction
} from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { blockchainNetworkController } from '../../controllers/blockchain-network-controller'
import { AuthMiddleware } from '../../middlewares/auth-middleware'
import {
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
  app.addHook('preHandler', AuthMiddleware.authorizeRoles(['ADMIN']))

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
      description: 'Get all availabe blockchain networks',
      tags: ['Blockchain networks'],
      response: {
        200: blockchainNetworkSchema.array(),
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
        200: blockchainNetworkSchema,
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
      body: createBlockchainNetworkSchema
    },
    handler: blockchainNetworkController.createNetwork
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PUT',
    url: '/:id',
    schema: {
      description: 'Update blockchain networks',
      tags: ['Blockchain networks'],
      params: updateBlockchainNetworkParamsSchema,
      body: updateBlockchainNetworkBodySchema
    },
    handler: blockchainNetworkController.updateNetwork
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      description: 'Delete blockchain networks',
      tags: ['Blockchain networks'],
      params: deleteBlockchainNetworkParamsSchema
    },
    handler: blockchainNetworkController.removeNetwork
  })

  done()
}
