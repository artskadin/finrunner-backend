import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { userController } from '../../controllers/user-controller'
import { $ref } from '../../schemas/user-schema'
import { AuthMiddleware } from '../../middlewares/auth-middleware'

export function userRouter(app: FastifyInstance, opts: FastifyPluginOptions) {
  app.get(
    '/',
    { preHandler: AuthMiddleware.authorizeRoles(['ADMIN']) },
    userController.getAllUsers
  )

  app.get('/:id', userController.getUserById)

  app.get(
    '/telegramId/:id',
    {
      schema: {
        params: $ref('getUserByTgIdSchema')
      }
    },
    userController.getUserByTelegramId
  )
}
