import { FastifyInstance } from 'fastify'
import { authSchemas } from './auth-schema'
import { userSchemas } from './user-schema'
import { blockchainNetworkSchemas } from './blockchain-network-schema'

export function registerSchemas(app: FastifyInstance) {
  const allSchemas = [
    ...authSchemas,
    ...userSchemas,
    ...blockchainNetworkSchemas
  ]

  for (const schema of allSchemas) {
    app.addSchema(schema)
  }
}
