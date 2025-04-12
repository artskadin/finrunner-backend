import {
  FastifyInstance,
  FastifyPluginOptions,
  HookHandlerDoneFunction
} from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { userController } from '../../controllers/user-controller'
import {
  getUserByIdSchema,
  getUserByTgIdSchema,
  userSchema
} from '../../schemas/user-schema'
import { AuthMiddleware } from '../../middlewares/auth-middleware'
import {
  apiErrorResponseSchema,
  internalServerErrorResponseSchema
} from '../../schemas/api-error-schema'

export function userRouter(
  app: FastifyInstance,
  opts: FastifyPluginOptions,
  done: HookHandlerDoneFunction
) {
  app.addHook('preHandler', AuthMiddleware.authenticate)

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
      description: 'Get all users',
      tags: ['Users'],
      response: {
        200: userSchema.array().describe('List of users'),
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    preHandler: AuthMiddleware.authorizeRoles(['ADMIN']),
    handler: userController.getUsers
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/me',
    schema: {
      description: 'Get current authenticated user data',
      tags: ['Users'],
      response: {
        200: userSchema,
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: userController.getMe
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/:id',
    schema: {
      description: 'Get User by userId',
      tags: ['Users'],
      params: getUserByIdSchema,
      response: {
        200: userSchema,
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: userController.getUserById
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/telegramId/:telegramId',
    schema: {
      description: 'Get User by telegramId',
      tags: ['Users'],
      params: getUserByTgIdSchema,
      response: {
        200: userSchema,
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: userController.getUserByTelegramId
  })

  done()
}
