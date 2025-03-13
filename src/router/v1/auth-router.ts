import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { authController } from '../../controllers/auth-controller'
import { $ref } from '../../schemas/auth-schema'

export function authRouter(app: FastifyInstance, opts: FastifyPluginOptions) {
  app.post(
    '/otp',
    {
      schema: {
        body: $ref('otpSchema')
      }
    },
    authController.getOtp
  )

  app.post(
    '/authorize',
    {
      schema: {
        body: $ref('authorizeSchema')
      }
    },
    authController.authorize
  )

  app.get('/refresh', authController.refresh)

  app.post('/logout', authController.logout)
}
