import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { AuthMiddleware } from '../../middlewares/auth-middleware'

export function cryptoWalletRouter(
  app: FastifyInstance,
  opts: FastifyPluginOptions
) {
  app.addHook('preHandler', AuthMiddleware.authenticate)
  app.addHook('preHandler', AuthMiddleware.authorizeRoles(['ADMIN']))
}
