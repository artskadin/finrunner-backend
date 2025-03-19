import { WalletStatus } from '@prisma/client'
import { z } from 'zod'
import { paginationSchema } from './general-schemas'

export const cryptoWalletSchema = z.object({
  id: z.string().uuid(),
  blockchainNetworkId: z.string().uuid(),
  address: z.string(),
  publicKey: z.string(),
  privateKey: z.string(),
  seedPhrase: z.string().optional(),
  status: z.nativeEnum(WalletStatus),
  createdAt: z.date(),
  updatedAt: z.date().nullable()
})

const filtersSchemas = z
  .object({
    blockchainNetworkId: z.string().uuid(),
    status: z.nativeEnum(WalletStatus).array(),
    createdAtGte: z.string().datetime(),
    createdAtLte: z.string().datetime()
  })
  .partial()

const orderBySchema = z.object({
  orderByCreatedAt: z.enum(['asc', 'desc']).optional().default('desc')
})

export const cryptoWalletsQueryParamsSchema = paginationSchema
  .merge(filtersSchemas)
  .merge(orderBySchema)

export const getCryptoWalletByIdSchema = cryptoWalletSchema.pick({ id: true })

export const getCryptoWalletsResponseSchema = z.object({
  items: cryptoWalletSchema.array(),
  pagination: z.object({
    limit: z.string(),
    offset: z.string(),
    total: z.string()
  }),
  filters: filtersSchemas,
  orderBy: orderBySchema
})

export const createCryptoWalletSchema = cryptoWalletSchema.pick({
  blockchainNetworkId: true
})

export const updateCryptoWalletBodySchema = cryptoWalletSchema.pick({
  status: true
})

export type CreateCryptoWallerInput = z.infer<typeof createCryptoWalletSchema>
export type GetCryptoWalletbyIdInput = z.infer<typeof getCryptoWalletByIdSchema>
export type GetCryptoWalletsQueryParamsInput = z.infer<
  typeof cryptoWalletsQueryParamsSchema
>
export type GetCryptoWalletsResponseOutput = z.infer<
  typeof getCryptoWalletsResponseSchema
>
export type UpdateCryptoWalletBodyInput = z.infer<
  typeof updateCryptoWalletBodySchema
>
