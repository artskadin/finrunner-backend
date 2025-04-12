import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { authController } from '../../controllers/auth-controller'
import {
  authorizeResponseSchema,
  authorizeSchema,
  otpSchema
} from '../../schemas/auth-schema'
import {
  apiErrorResponseSchema,
  internalServerErrorResponseSchema
} from '../../schemas/api-error-schema'

export function authRouter(app: FastifyInstance, opts: FastifyPluginOptions) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/otp',
    schema: {
      description: 'Trigger telegram bot to send otp code',
      tags: ['Auth'],
      security: [],
      body: otpSchema
    },
    handler: authController.getOtp
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/authorize',
    schema: {
      description: 'Authorize user',
      tags: ['Auth'],
      security: [],
      body: authorizeSchema,
      response: {
        200: authorizeResponseSchema,
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: authController.authorize
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/refresh',
    schema: {
      description: 'Refresh JWT tokens',
      tags: ['Auth'],
      security: [],
      response: {
        200: authorizeResponseSchema,
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: authController.refresh
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/logout',
    schema: {
      description: 'Logout user',
      tags: ['Auth'],
      security: []
    },
    handler: authController.logout
  })
}
