import {
  FastifyInstance,
  FastifyPluginOptions,
  HookHandlerDoneFunction
} from 'fastify'
import { AuthMiddleware } from '../../middlewares/auth-middleware'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { cryptoAssetController } from '../../controllers/crypto-asset-controller'
import {
  createCryptoAssetSchema,
  cryptoAssetSchema,
  deleteCryptoAssetParamsSchema,
  getCryptoAssetByIdSchema,
  updateCryptoAssetBodySchema,
  updateCryptoAssetParamsSchema
} from '../../schemas/crypto-asset-schema'
import {
  apiErrorResponseSchema,
  internalServerErrorResponseSchema
} from '../../schemas/api-error-schema'

export function cryptoAssetRouter(
  app: FastifyInstance,
  opts: FastifyPluginOptions,
  done: HookHandlerDoneFunction
) {
  app.addHook('preHandler', AuthMiddleware.authenticate)
  app.addHook(
    'preHandler',
    AuthMiddleware.authorizeRoles(['ADMIN', 'OPERATOR'])
  )

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
      description: 'Get all available crypto assets',
      tags: ['crypto assets'],
      response: {
        200: cryptoAssetSchema.array().nullable(),
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: cryptoAssetController.getCryptoAssets
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/:id',
    schema: {
      description: 'Get crypto asset by id',
      tags: ['crypto assets'],
      params: getCryptoAssetByIdSchema,
      response: {
        200: cryptoAssetSchema.nullable(),
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: cryptoAssetController.getCryptoAssetById
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/',
    schema: {
      description: 'Create crypto asset',
      tags: ['crypto assets'],
      body: createCryptoAssetSchema,
      response: {
        201: cryptoAssetSchema,
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: cryptoAssetController.createCryptoAsset,
    preHandler: AuthMiddleware.authorizeRoles(['ADMIN'])
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      description: 'Patch crypto asset',
      tags: ['crypto assets'],
      params: updateCryptoAssetParamsSchema,
      body: updateCryptoAssetBodySchema,
      response: {
        200: cryptoAssetSchema.nullable(),
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: cryptoAssetController.updateCryptoAsset,
    preHandler: AuthMiddleware.authorizeRoles(['ADMIN'])
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      description: 'Delete crypto asset',
      tags: ['crypto assets'],
      params: deleteCryptoAssetParamsSchema,
      response: {
        200: cryptoAssetSchema.nullable(),
        400: apiErrorResponseSchema,
        401: apiErrorResponseSchema,
        404: apiErrorResponseSchema,
        500: internalServerErrorResponseSchema
      }
    },
    handler: cryptoAssetController.deleteCryptoAsset,
    preHandler: AuthMiddleware.authorizeRoles(['ADMIN'])
  })

  done()
}
