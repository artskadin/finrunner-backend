import { z } from 'zod'

export const paginationSchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((value) => (value ? parseInt(value) : undefined))
    .refine((value) => value === undefined || value >= 1, {
      message: 'limit must be at list 1'
    })
    .default('10'),
  offset: z
    .string()
    .optional()
    .transform((value) => (value ? parseInt(value) : undefined))
    .refine((value) => value === undefined || value >= 0, {
      message: 'offset must be greater than or equal to zero'
    })
    .default('0')
})
