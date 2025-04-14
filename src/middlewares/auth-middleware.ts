import { FastifyReply, FastifyRequest } from 'fastify'
import { UserRole } from '@prisma/client'
import { ApiError } from '../exceptions/api-error'
import { getTokenService } from '../services/token-services'
import { userService } from '../services/user-service'

export class AuthMiddleware {
  public static async authenticate(req: FastifyRequest, reply: FastifyReply) {
    try {
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
        const userFromRequest = req.user

        if (!userFromRequest) {
          throw ApiError.Unauthorized()
        }

        const freshUser = await userService.getUserById(userFromRequest?.id)

        if (freshUser && !userRoles.includes(freshUser.role)) {
          throw ApiError.Forbidden(freshUser.id)
        }
      } catch (err) {
        throw err
      }
    }
  }
}
