import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { userController } from '../../controllers/user-controller'
import { $ref } from '../../schemas/user-schema'

export function userRouter(app: FastifyInstance, opts: FastifyPluginOptions) {
  app.post(
    '/registration',
    {
      schema: {
        body: $ref('registrationSchema')
      }
    },
    userController.registration
  )

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
