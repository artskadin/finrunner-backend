import { BidStatus } from '@prisma/client'
import { z } from 'zod'
import { paginationSchema } from './general-schemas'

export const bidSchema = z.object({
  id: z.string().uuid(),
  fromUserId: z.string().uuid(),
  status: z.nativeEnum(BidStatus),
  createdAt: z.date(),
  updatedAt: z.date().nullable()
})

export const createBidSchema = bidSchema.pick({ fromUserId: true })

const filtersSchema = z
  .object({
    fromUserId: z.string().uuid(),
    status: z.nativeEnum(BidStatus).array(),
    createdAtGte: z.string().datetime(),
    createdAtLte: z.string().datetime()
  })
  .partial()

const orderBySchema = z.object({
  orderByCreatedAt: z.enum(['asc', 'desc']).optional().default('desc'),
  orderByStatus: z.enum(['asc', 'desc']).optional()
})

export const bidQueryParamsSchema = paginationSchema
  .merge(filtersSchema)
  .merge(orderBySchema)

export const getBidByIdSchema = bidSchema.pick({ id: true })

export const getBidsResponseSchema = z.object({
  items: bidSchema.array(),
  pagination: z.object({
    limit: z.string(),
    offset: z.string(),
    total: z.string()
  }),
  filters: filtersSchema,
  orderBy: z.object({
    orderByCreatedAt: z.enum(['asc', 'desc']).optional(),
    orderByStatus: z.enum(['asc', 'desc']).optional()
  })
})

export const updateBidBodySchema = bidSchema.pick({ status: true })

export type CreateBidInput = z.infer<typeof createBidSchema>
export type GetBidByIdInput = z.infer<typeof getBidByIdSchema>
export type GetBidsQueryParamsInput = z.infer<typeof bidQueryParamsSchema>
export type GetBidsResponseOutput = z.infer<typeof getBidsResponseSchema>
export type UpdateBidBodyInput = z.infer<typeof updateBidBodySchema>
