import { FastifyReply, FastifyRequest } from 'fastify'
import { UserRole } from '@prisma/client'
import { ApiError } from '../exceptions/api-error'
import { getTokenService } from '../services/token-services'

export class AuthMiddleware {
  public static async authenticate(req: FastifyRequest, reply: FastifyReply) {
    try {
      if (req.url.startsWith('/ping') || req.url.startsWith('/api/v1/auth')) {
        return
      }

      const accessToken = req.headers.authorization?.split(' ')[1]

      if (!accessToken) {
        throw ApiError.Unauthorized()
      }

      const tokenService = getTokenService()

      const tokenData = tokenService.validateAccessToken(accessToken)

      if (!tokenData) {
        throw ApiError.Unauthorized()
      }

      req.user = {
        id: tokenData.userId,
        telegramId: tokenData.telegramId,
        role: tokenData.userRole as UserRole
      }
    } catch (err) {
      throw err
    }
  }

  public static authorizeRoles(userRoles: UserRole[]) {
    return async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = req.user

        if (!user) {
          throw ApiError.Unauthorized()
        }

        if (!userRoles.includes(user.role)) {
          throw ApiError.Forbidden(user.id)
        }
      } catch (err) {
        throw err
      }
    }
  }
}
