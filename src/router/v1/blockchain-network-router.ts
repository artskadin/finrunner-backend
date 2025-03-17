import { FastifyInstance, FastifyPluginOptions } from 'fastify'
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

export function blockchainNetworkRouter(
  app: FastifyInstance,
  opts: FastifyPluginOptions
) {
  app.addHook('preHandler', AuthMiddleware.authorizeRoles(['ADMIN']))

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        200: blockchainNetworkSchema.array()
      }
    },
    handler: blockchainNetworkController.getNetworks
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/:id',
    schema: {
      params: getblockchainNetworkByIdSchema,
      response: {
        200: blockchainNetworkSchema
      }
    },
    handler: blockchainNetworkController.getNetworkById
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/',
    schema: {
      body: createBlockchainNetworkSchema
    },
    handler: blockchainNetworkController.createNetwork
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PUT',
    url: '/:id',
    schema: {
      params: updateBlockchainNetworkParamsSchema,
      body: updateBlockchainNetworkBodySchema
    },
    handler: blockchainNetworkController.updateNetwork
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'DELETE',
    url: '/:id',
    schema: { params: deleteBlockchainNetworkParamsSchema },
    handler: blockchainNetworkController.removeNetwork
  })
}
