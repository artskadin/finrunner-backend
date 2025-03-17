import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { userController } from '../../controllers/user-controller'
import {
  getUserByIdSchema,
  getUserByTgIdSchema,
  userSchema
} from '../../schemas/user-schema'
import { AuthMiddleware } from '../../middlewares/auth-middleware'

export function userRouter(app: FastifyInstance, opts: FastifyPluginOptions) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        200: userSchema.array()
      }
    },
    preHandler: AuthMiddleware.authorizeRoles(['ADMIN']),
    handler: userController.getUsers
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/:id',
    schema: {
      params: getUserByIdSchema,
      response: {
        200: userSchema
      }
    },
    handler: userController.getUserById
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/telegramId/:id',
    schema: {
      params: getUserByTgIdSchema,
      response: {
        200: userSchema
      }
    },
    handler: userController.getUserByTelegramId
  })
}
