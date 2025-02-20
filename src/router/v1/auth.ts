import { FastifyInstance, FastifyPluginOptions } from 'fastify'

export function authRouter(app: FastifyInstance, opts: FastifyPluginOptions) {
  app.get('/auth', (req, reply) => {
    reply.send('AUTH')
  })
}
