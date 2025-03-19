import Fastify from 'fastify'
import fastifyEnv from '@fastify/env'
import cookie from '@fastify/cookie'
import {
  serializerCompiler,
  validatorCompiler
} from 'fastify-type-provider-zod'

import { userRouter as v1UserRouter } from './router/v1/user-router'
import { authRouter as v1AuthRouter } from './router/v1/auth-router'
import { blockchainNetworkRouter as v1BlockchainNetworkRouter } from './router/v1/blockchain-network-router'
import { currencyRouter as v1CurrencyRouter } from './router/v1/currency-router'
import { exchangePairRouter as v1ExchangePairRouter } from './router/v1/exchange-pair-router'
import { bidRouter as v1BidRouter } from './router/v1/bid-router'
import { cryptoWalletRouter as v1CryptoWalletRouter } from './router/v1/crypto-wallet-router'

import { Envs, schema } from './envSettings'
import { prismaPlugin } from './plugins/prisma-plugin'
import { kafkaServie } from './services/kafka/kafka-service'
import { kafkaEventHandlerRegistry } from './services/kafka/event-handler-registry'
import { UpdateUserFromTgBotEventHandler } from './services/kafka/event-handlers'
import { KafkaTopics } from './services/kafka/kafka-topics'
import { getRedisService } from './services/redis-service'
import { ApiError } from './exceptions/api-error'
import { getTokenService } from './services/token-services'
import { AuthMiddleware } from './middlewares/auth-middleware'
import { getEncryptionService } from './services/encryption-service'

const options = {
  schema,
  dotenv: true
}

const app = Fastify({
  logger: true
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cookie)
app.register(fastifyEnv, options)
await app.after()
const envs = app.getEnvs<Envs>()

app.setErrorHandler((error, req, reply) => {
  if (error.validation && error.validationContext) {
    return reply.status(400).send({
      type: 'BAD_REQUEST',
      message: error.message
    })
  }

  if (error instanceof ApiError) {
    reply.status(error.status).send({
      error: {
        type: error.type,
        message: error.message,
        details: error.details
      }
    })
  } else {
    app.log.error('Unhandled error:', error)
    console.error(error)
    reply.status(500).send({
      error: {
        type: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
      }
    })
  }
})

app.addHook('onReady', async () => {
  try {
    const redisService = getRedisService(envs)
    const tokenService = getTokenService(envs)
    const encryptionService = getEncryptionService(envs)

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

app.addHook('preHandler', AuthMiddleware.authenticate)

app.register(prismaPlugin)
app.register(v1AuthRouter, { prefix: '/api/v1/auth' })
app.register(v1UserRouter, { prefix: '/api/v1/users' })
app.register(v1BlockchainNetworkRouter, {
  prefix: '/api/v1/blockchain-networks'
})
app.register(v1CurrencyRouter, { prefix: '/api/v1/currencies' })
app.register(v1ExchangePairRouter, { prefix: '/api/v1/exchange-pairs' })
app.register(v1BidRouter, { prefix: '/api/v1/bids' })
// app.register(v1CryptoWalletRouter, { prefix: '/api/v1/crypto-wallets' })

app.get('/ping', async (req, reply) => {
  reply.status(200).send({ message: 'pong' })
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
