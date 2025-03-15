import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const blockchainNetworkSchema = z.object({
  id: z.string(),
  name: z.string(),
  tokenStandart: z.string()
})

const createBlockchainNetworkSchema = blockchainNetworkSchema.omit({
  id: true
})

const getblockchainNetworkByIdSchema = blockchainNetworkSchema.pick({
  id: true
})

const updateBlockchainNetworkBodySchema = blockchainNetworkSchema.omit({
  id: true
})

const updateBlockchainNetworkParamsSchema = blockchainNetworkSchema.pick({
  id: true
})

const deleteBlockchainNetworkParamsSchema = blockchainNetworkSchema.pick({
  id: true
})

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

export const { schemas: blockchainNetworkSchemas, $ref } = buildJsonSchemas(
  {
    blockchainNetworkSchema,
    createBlockchainNetworkSchema,
    getblockchainNetworkByIdSchema,
    updateBlockchainNetworkBodySchema,
    updateBlockchainNetworkParamsSchema,
    deleteBlockchainNetworkParamsSchema
  },
  { $id: 'blockchainNetworkSchemas' }
)
