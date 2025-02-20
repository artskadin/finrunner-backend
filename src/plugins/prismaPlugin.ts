import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

const prismaPlugin: FastifyPluginAsync = fp(async (app, options) => {
  const prisma = new PrismaClient()

  try {
    await prisma.$connect()
    app.log.info('Prisma successfully connected to the database')
  } catch (err) {
    // TODO error type
    app.log.error(`Prisma failed to connect to the database: ${err}`)
    process.exit(1)
  }

  app.decorate('prisma', prisma)

  app.addHook('onClose', async (server) => {
    await server.prisma.$disconnect()
    app.log.info('Prisma connection closed')
  })
})

export { prismaPlugin }
