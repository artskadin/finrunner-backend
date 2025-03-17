import { z } from 'zod'
import { Decimal } from 'decimal.js'

export const exchangePairSchema = z.object({
  id: z.string().uuid(),
  fromCurrencyId: z.string().uuid(),
  toCurrencyId: z.string().uuid(),
  markupPercentage: z
    .string()
    .refine((value) => !isNaN(parseFloat(value)), {
      message: 'markupPercentage must be a valid number as a string'
    })
    .refine((value) => parseFloat(value) >= 0, {
      message: 'Markup percentage must be a valid non-negative Decimal'
    })
    .transform((value) => new Decimal(value)),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date().nullable()
})

export const createExchangePairSchema = exchangePairSchema.pick({
  fromCurrencyId: true,
  toCurrencyId: true,
  markupPercentage: true
})
export const getExchangePairByIdSchema = exchangePairSchema.pick({ id: true })
export const updateExchangePairParamsSchema = exchangePairSchema.pick({
  id: true
})
export const updateExchangePairBodySchema = exchangePairSchema
  .pick({
    fromCurrencyId: true,
    toCurrencyId: true,
    markupPercentage: true,
    isActive: true
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
