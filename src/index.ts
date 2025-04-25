import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import fastifyEnv from '@fastify/env'
import cookie from '@fastify/cookie'
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  createJsonSchemaTransformObject
} from 'fastify-type-provider-zod'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import fastifyCors from '@fastify/cors'

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
import { BlockchainManager } from './blockchain-manager'
import { Blockchain } from './blockchain-manager/blockchain-manager'
import { CreateWalletEventHandler } from './services/kafka/events-handlers/create-wallet-event-handler'
import { env } from './envSettings/env'
import { schemas } from './schemas'
import { version } from '../package.json'
import { cryptoAssetRouter } from './router/v1/crypto-asset-router'

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
app.register(fastifyEnv, options) // remove
await app.after()
const envs = app.getEnvs<Envs>()

app.register(fastifyCors, {
  origin: (origin, cb) => {
    if (!origin) {
      return cb(null, true)
    }

    const hostname = new URL(origin).hostname

    if (hostname === 'localhost') {
      return cb(null, true)
    }

    const allowedOrigins: string[] = []

    if (allowedOrigins.includes(origin)) {
      return cb(null, true)
    }

    console.warn(`CORS: Origin ${origin} not allowed`)
    cb(new Error('Not allowed by CORS'), false)
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
})

app.setErrorHandler((error, req, reply) => {
  if (error.validation && error.validationContext) {
    return reply.status(400).send({
      type: 'BAD_REQUEST',
      message: error.message
    })
  }

  if (error instanceof ApiError) {
    reply.status(error.status).send({
      type: error.type,
      message: error.message,
      details: error.details
    })
  } else {
    app.log.error('Unhandled error:', error)
    console.error(error)
    reply.status(500).send({
      type: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    })
  }
})

app.addHook('onReady', async () => {
  try {
    const redisService = getRedisService(envs)
    const tokenService = getTokenService(envs)
    const encryptionService = getEncryptionService(envs)

    await kafkaServie.connect()

    kafkaEventHandlerRegistry.registerHandler(
      new UpdateUserFromTgBotEventHandler()
    )
    kafkaEventHandlerRegistry.registerHandler(new CreateWalletEventHandler())

    kafkaServie.consume(KafkaTopics.UserEvents)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
})

//SWAGGER settings
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'FinRunner API',
      description: 'API documentation for FinRunner monolith',
      version
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  transform: jsonSchemaTransform,
  transformObject: createJsonSchemaTransformObject({
    schemas
  })
})

app.register(fastifySwaggerUI, {
  routePrefix: '/api/documentation',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true
  },
  staticCSP: true
})

app.register(
  async function swaggerProtectionPlugin(app) {
    app.addHook('preHandler', AuthMiddleware.authenticate)
    app.addHook('preHandler', AuthMiddleware.authorizeRoles(['ADMIN']))
  },
  {
    prefix: '/api/documentation'
  }
)
app.register(prismaPlugin)
app.register(v1AuthRouter, { prefix: '/api/v1/auth' })
app.register(v1UserRouter, { prefix: '/api/v1/users' })
app.register(v1BlockchainNetworkRouter, {
  prefix: '/api/v1/blockchain-networks'
})
app.register(v1CurrencyRouter, { prefix: '/api/v1/currencies' })
app.register(cryptoAssetRouter, { prefix: '/api/v1/crypto-assets' })
app.register(v1ExchangePairRouter, { prefix: '/api/v1/exchange-pairs' })
app.register(v1BidRouter, { prefix: '/api/v1/bids' })
// app.register(v1CryptoWalletRouter, { prefix: '/api/v1/crypto-wallets' })

app.get('/ping', async (req, reply) => {
  // const manager = new BlockchainManager({
  //   chainType: 'testnet',
  //   apiKey: env.ALCHEMY_API_KEY,
  //   rpcUrl: env.ETH_TESTNET_PROVIDER_RPC_URL
  // })

  // const balance = await manager.getWalletBalance(
  //   Blockchain.ETHEREUM,
  //   '0xa949Bb82473Ff96c911BE8298A28FC3EBC942F4c'
  // )
  // console.log({ balance })

  reply.status(200).send({ message: 'pong' })
})

await app.ready()
// app.swagger()

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

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception!!!')
  console.error(err)
})
