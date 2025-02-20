import Fastify from 'fastify'
import { prismaPlugin } from './plugins/prismaPlugin'
import { authRouter as v1AuthRouter } from './router/v1/auth'
import { registerRouter as v1RegisterRouter } from './router/v1/register'

const app = Fastify({
  logger: true
})

app.register(prismaPlugin)
app.register(v1AuthRouter, { prefix: '/api/v1' })
app.register(v1RegisterRouter, { prefix: '/api/v1' })

app.get('/', (req, reply) => {
  reply.send('main page')
})

app.listen({ port: 3000, host: '0.0.0.0' }, async (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`FinRunner backend is running on ${address}`)
})
