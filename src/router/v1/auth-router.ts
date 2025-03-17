import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { authController } from '../../controllers/auth-controller'
import {
  authorizeResponseSchema,
  authorizeSchema,
  otpSchema
} from '../../schemas/auth-schema'

export function authRouter(app: FastifyInstance, opts: FastifyPluginOptions) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/otp',
    schema: {
      body: otpSchema
    },
    handler: authController.getOtp
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/authorize',
    schema: {
      body: authorizeSchema,
      response: {
        200: authorizeResponseSchema
      }
    },
    handler: authController.authorize
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/refresh',
    schema: {
      response: {
        200: authorizeResponseSchema
      }
    },
    handler: authController.refresh
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/logout',
    handler: authController.logout
  })
}
