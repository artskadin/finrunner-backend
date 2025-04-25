import { z } from 'zod'
import { currencySchema } from './currency-schema'
import { blockchainNetworkSchema } from './blockchain-network-schema'

export const cryptoAssetSchema = z.object({
  id: z.string(),
  currencyId: z.string().uuid(),
  blockchainNetworkId: z.string().uuid(),
  createdAt: z.date(),
  currency: currencySchema.optional(),
  blockchainNetwork: blockchainNetworkSchema.optional()
})

export const createCryptoAssetSchema = cryptoAssetSchema.pick({
  currencyId: true,
  blockchainNetworkId: true
})
export const getCryptoAssetByIdSchema = cryptoAssetSchema.pick({ id: true })
export const updateCryptoAssetParamsSchema = cryptoAssetSchema.pick({
  id: true
})
export const updateCryptoAssetBodySchema = cryptoAssetSchema
  .pick({
    currencyId: true,
    blockchainNetworkId: true
  })
  .partial()
export const deleteCryptoAssetParamsSchema = cryptoAssetSchema.pick({
  id: true
})

export type CreateCryptoAssetInput = z.infer<typeof createCryptoAssetSchema>
export type GetCryptoAssetByIdInput = z.infer<typeof getCryptoAssetByIdSchema>
export type UpdateCryptoAssetParams = z.infer<
  typeof updateCryptoAssetParamsSchema
>
export type UpdateCryptoAssetBody = z.infer<typeof updateCryptoAssetBodySchema>
export type DeleteCryptoAssetParams = z.infer<
  typeof deleteCryptoAssetParamsSchema
>
