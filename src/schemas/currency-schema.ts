import { z } from 'zod'

export const currencySchema = z.object({
  id: z.string().uuid(),
  fullname: z.string(),
  shortname: z.string(),
  createdAt: z.date()
})

export const createCurrencySchema = currencySchema.omit({
  id: true,
  createdAt: true
})
export const getCurrencyByIdSchema = currencySchema.pick({ id: true })
export const updateCurrencyBodySchema = currencySchema
  .omit({
    id: true,
    createdAt: true
  })
  .partial()
export const updateCurrencyParamsSchema = currencySchema.pick({ id: true })
export const deleteCurrencySchema = currencySchema.pick({ id: true })

export type CreateCurrencyInput = z.infer<typeof createCurrencySchema>
export type GetCurrencyByIdInput = z.infer<typeof getCurrencyByIdSchema>
export type UpdateCurrencyBodyInput = z.infer<typeof updateCurrencyBodySchema>
export type UpdateCurrencyParamsInput = z.infer<
  typeof updateCurrencyParamsSchema
>
export type DeleteCurrencyInput = z.infer<typeof deleteCurrencySchema>
