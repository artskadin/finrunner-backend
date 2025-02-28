import Fastify from 'fastify'
import { prismaPlugin } from './plugins/prisma-plugin'
import { userRouter as v1UserRouter } from './router/v1/user-router'
import { authRouter as v1AuthRouter } from './router/v1/auth-router'
import { kafkaServie } from './services/kafka/kafka-service'
import { kafkaEventHandlerRegistry } from './services/kafka/event-handler-registry'
import { UpdateUserFromTgBotEventHandler } from './services/kafka/event-handlers'
import { registerSchemas } from './schemas'
import { KafkaTopics } from './services/kafka/kafka-topics'

const app = Fastify({
  logger: true
})

app.addHook('onListen', async () => {
  try {
    kafkaEventHandlerRegistry.registerHandler(
      new UpdateUserFromTgBotEventHandler()
    )

    await kafkaServie.connect()

    kafkaServie.consume(KafkaTopics.UserEvents)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
})

registerSchemas(app)
app.register(prismaPlugin)
app.register(v1AuthRouter, { prefix: '/api/v1/auth' })
app.register(v1UserRouter, { prefix: '/api/v1/users' })

app.get('/', (req, reply) => {
  reply.send('main page')
})

const start = async () => {
  try {
    const address = await app.listen({ port: 3000, host: '0.0.0.0' })
    app.log.info(`FinRunner backend is running on ${address}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
