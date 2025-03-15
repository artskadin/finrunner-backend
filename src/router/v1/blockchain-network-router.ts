import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { blockchainNetworkController } from '../../controllers/blockchain-network-controller'
import { $ref } from '../../schemas/blockchain-network-schema'
import { AuthMiddleware } from '../../middlewares/auth-middleware'

export function blockchainNetworkRouter(
  app: FastifyInstance,
  opts: FastifyPluginOptions
) {
  app.addHook('preHandler', AuthMiddleware.authorizeRoles(['ADMIN']))

  app.get('/', blockchainNetworkController.getAllNetworks)

  app.get(
    '/:id',
    {
      schema: {
        params: $ref('getblockchainNetworkByIdSchema')
      }
    },
    blockchainNetworkController.getNetworkById
  )

  app.post(
    '/',
    {
      schema: {
        body: $ref('createBlockchainNetworkSchema')
      }
    },
    blockchainNetworkController.createNetwork
  )

  app.put(
    '/:id',
    {
      schema: {
        params: $ref('updateBlockchainNetworkParamsSchema'),
        body: $ref('updateBlockchainNetworkBodySchema')
      }
    },
    blockchainNetworkController.updateNetwork
  )

  app.delete(
    '/:id',
    {
      schema: {
        params: $ref('deleteBlockchainNetworkParamsSchema')
      }
    },
    blockchainNetworkController.removeNetwork
  )
}
