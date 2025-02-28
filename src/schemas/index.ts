import { FastifyInstance } from 'fastify'
import { authSchemas } from './auth-schema'
import { userSchemas } from './user-schema'

export function registerSchemas(app: FastifyInstance) {
  const allSchemas = [...authSchemas, ...userSchemas]

  for (const schema of allSchemas) {
    app.addSchema(schema)
  }
}
