import { buildJsonSchemas } from 'fastify-zod'
import { z } from 'zod'

const currencySchema = z.object({
  id: z.string(),
  fullname: z.string(),
  shortname: z.string()
})

const createCurrencySchema = currencySchema.omit({ id: true })
const getCurrencyByIdSchema = currencySchema.pick({ id: true })
const updateCurrencyBodySchema = currencySchema.omit({ id: true })
const updateCurrencyParamsSchema = currencySchema.pick({ id: true })
const deleteCurrencySchema = currencySchema.pick({ id: true })

export type CreateCurrencyInput = z.infer<typeof createCurrencySchema>
export type GetCurrencyByIdInput = z.infer<typeof getCurrencyByIdSchema>
export type UpdateCurrencyBodyInput = z.infer<typeof updateCurrencyBodySchema>
export type UpdateCurrencyParamsInput = z.infer<
  typeof updateCurrencyParamsSchema
>
export type DeleteCurrencyInput = z.infer<typeof deleteCurrencySchema>

export const { schemas: currencySchemas, $ref } = buildJsonSchemas(
  {
    currencySchema,
    createCurrencySchema,
    getCurrencyByIdSchema,
    updateCurrencyBodySchema,
    updateCurrencyParamsSchema,
    deleteCurrencySchema
  },
  { $id: 'currencySchemas' }
)
