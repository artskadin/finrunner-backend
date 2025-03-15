import { FastifyInstance } from 'fastify'
import { authSchemas } from './auth-schema'
import { userSchemas } from './user-schema'
import { blockchainNetworkSchemas } from './blockchain-network-schema'
import { currencySchemas } from './currency-schema'

export function registerSchemas(app: FastifyInstance) {
  const allSchemas = [
    ...authSchemas,
    ...userSchemas,
    ...blockchainNetworkSchemas,
    ...currencySchemas
  ]

  for (const schema of allSchemas) {
    app.addSchema(schema)
  }
}
