import { FastifyInstance, FastifyPluginOptions } from 'fastify'

export function registerRouter(
  app: FastifyInstance,
  opts: FastifyPluginOptions
) {
  app.post('/register', (req, reply) => {})
}
