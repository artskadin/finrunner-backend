import { z } from 'zod'

export const blockchainNetworkSchema = z.object({
  id: z.string(),
  name: z.string(),
  tokenStandart: z.string()
})

export const createBlockchainNetworkSchema = blockchainNetworkSchema.omit({
  id: true
})
export const getblockchainNetworkByIdSchema = blockchainNetworkSchema.pick({
  id: true
})
export const updateBlockchainNetworkBodySchema = blockchainNetworkSchema.omit({
  id: true
})
export const updateBlockchainNetworkParamsSchema = blockchainNetworkSchema.pick(
  {
    id: true
  }
)
export const deleteBlockchainNetworkParamsSchema = blockchainNetworkSchema.pick(
  {
    id: true
  }
)

export type CreateBlockchainNetworkInput = z.infer<
  typeof createBlockchainNetworkSchema
>
export type GetBlockchainNetworkByIdInput = z.infer<
  typeof getblockchainNetworkByIdSchema
>
export type UpdateBlockchainNetworkBodyInput = z.infer<
  typeof updateBlockchainNetworkBodySchema
>
export type UpdateBlockchainNetworkParamsInput = z.infer<
  typeof updateBlockchainNetworkParamsSchema
>
export type DeleteBlockchainNetworkInput = z.infer<
  typeof deleteBlockchainNetworkParamsSchema
>
