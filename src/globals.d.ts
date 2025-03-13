import { UserRole } from '@prisma/client'
import { FastifyRequest } from 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string
      telegramId: string
      role: UserRole
    }
    cookies: {
      refreshToken?: string
    }
  }
}
