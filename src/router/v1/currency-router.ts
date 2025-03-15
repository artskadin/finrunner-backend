import { FastifyPluginOptions } from 'fastify'
import { FastifyInstance } from 'fastify/types/instance'
import { $ref } from '../../schemas/currency-schema'
import { currencyController } from '../../controllers/currency-controller'
import { AuthMiddleware } from '../../middlewares/auth-middleware'

export function currencyRouter(
  app: FastifyInstance,
  opts: FastifyPluginOptions
) {
  app.addHook('preHandler', AuthMiddleware.authorizeRoles(['ADMIN']))

  app.get('/', currencyController.getAllCurrencies)

  app.get(
    '/:id',
    {
      schema: {
        params: $ref('getCurrencyByIdSchema')
      }
    },
    currencyController.getCurrencyById
  )

  app.post(
    '/',
    {
      schema: {
        body: $ref('createCurrencySchema')
      }
    },
    currencyController.createCurrency
  )

  app.put(
    '/:id',
    {
      schema: {
        params: $ref('updateCurrencyParamsSchema'),
        body: $ref('updateCurrencyBodySchema')
      }
    },
    currencyController.updateCurrency
  )

  app.delete(
    '/:id',
    { schema: { params: $ref('deleteCurrencySchema') } },
    currencyController.removeCurrency
  )
}
