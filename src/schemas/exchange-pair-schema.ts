import { z } from 'zod'
import { Decimal } from 'decimal.js'
import { ExchangePairStatus } from '@prisma/client'
import { cryptoAssetSchema } from './crypto-asset-schema'

export const exchangePairSchema = z.object({
  id: z.string().uuid(),
  fromCryptoAssetId: z.string().uuid().nullish(),
  toCryptoAssetId: z.string().uuid().nullish(),
  fromFiatAssetId: z.string().uuid().nullish(),
  toFiatAssetId: z.string().uuid().nullish(),
  markupPercentage: z
    .string()
    .refine((value) => {
      const decimalRegex = /^(0|[1-9]\d*)(\.\d+)?$/
      return decimalRegex.test(value)
    })
    .refine((value) => !isNaN(parseFloat(value)), {
      message: 'markupPercentage must be a valid number as a string'
    })
    .refine((value) => parseFloat(value) >= 0, {
      message: 'Markup percentage must be a valid non-negative Decimal'
    })
    .transform((value) => new Decimal(value)),
  status: z.nativeEnum(ExchangePairStatus),
  createdAt: z.date(),
  updatedAt: z.date(),

  fromCryptoAsset: cryptoAssetSchema.optional(),
  toCryptoAsset: cryptoAssetSchema.optional(),
  // заглушки
  fromFiatAsset: z.string().nullish(),
  toFiatAsset: z.string().nullish()
})

export const createExchangePairSchema = exchangePairSchema
  .pick({
    fromCryptoAssetId: true,
    toCryptoAssetId: true,
    fromFiatAssetId: true,
    toFiatAssetId: true,
    markupPercentage: true,
    status: true
  })
  .partial()

export const getExchangePairByIdSchema = exchangePairSchema.pick({ id: true })
export const updateExchangePairParamsSchema = exchangePairSchema.pick({
  id: true
})
export const updateExchangePairBodySchema = exchangePairSchema
  .pick({
    markupPercentage: true,
    status: true
  })
  .partial()
export const deleteExchangePairSchema = exchangePairSchema.pick({ id: true })

export const exchangePairSchemaResponse = exchangePairSchema.extend({
  markupPercentage: z.string()
})

export type CreateExchangePairInput = z.infer<typeof createExchangePairSchema>
export type GetExchangePairByIdInput = z.infer<typeof getExchangePairByIdSchema>
export type UpdateExchangePairParamsInput = z.infer<
  typeof updateExchangePairParamsSchema
>
export type UpdateExchangePairBodyInput = z.infer<
  typeof updateExchangePairBodySchema
>
export type DeleteExchangePairInput = z.infer<typeof deleteExchangePairSchema>
