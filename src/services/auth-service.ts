import { ApiError } from '../exceptions/api-error'
import { userRepository } from '../repositories/user-repository'
import { AuthorizeInput } from '../schemas/auth-schema'
import { BaseService } from './base-service'
import { redisService } from './redis-service'
import { tgBotService } from './tgbot-service'
import { getTokenService } from './token-services'
import { userService } from './user-service'

/**
 * Сервис для работы с авторизацией пользователей
 */
class AuthService extends BaseService {
  private generateOtpCode(length: number = 6): string {
    return Math.random()
      .toString()
      .slice(2, length + 2)
  }

  async getOtp(tgUsername: string) {
    try {
      const user = await userRepository.getUserByTgUsername(tgUsername)

      const otpCode = this.generateOtpCode()

      if (user) {
        const tgId = user.telegramId.toString()

        redisService.saveOtpCode({ tgId, otpCode })

        tgBotService.sendOtp({ tgId, otpCode })

        return
      }

      throw ApiError.TelegramUsernameNotFound(tgUsername)
    } catch (err) {
      this.handleError(err)
    }
  }

  async authorize(data: AuthorizeInput) {
    try {
      const { telegramUsername, otpCode } = data

      const user = await userRepository.getUserByTgUsername(telegramUsername)

      if (!user) {
        throw ApiError.TelegramUsernameNotFound(telegramUsername)
      }

      const tgId = user.telegramId

      const otpCodeFromRedis = await redisService.getOtpCode(tgId)

      if (otpCodeFromRedis !== otpCode.toString()) {
        throw ApiError.OtpCodesNotMatch()
      }

      await redisService.deleteOtpCode(tgId)

      const tokenService = getTokenService()
      const { accessToken, refreshToken } = tokenService.generateTokens({
        userId: user.id,
        telegramId: user.telegramId,
        userRole: user.role
      })
      await tokenService.saveToken({ userId: user.id, refreshToken })

      return { user, accessToken, refreshToken }
    } catch (err) {
      this.handleError(err)
    }
  }

  async refresh(token: string) {
    try {
      const tokenService = getTokenService()

      const validatedToken = tokenService.validateRefreshToken(token)
      const tokenData = await tokenService.findToken(token)

      if (!validatedToken || !tokenData) {
        throw ApiError.InvalidRefreshToken()
      }

      await tokenService.removeToken(token)

      const user = await userService.getUserById(validatedToken.userId)

      if (!user) {
        throw ApiError.UserNotFound(validatedToken.userId)
      }

      const { accessToken, refreshToken } = tokenService.generateTokens({
        userId: user.id,
        telegramId: user.telegramId,
        userRole: user.role
      })

      await tokenService.saveToken({
        userId: validatedToken.userId,
        refreshToken
      })

      return { userId: validatedToken.userId, accessToken, refreshToken }
    } catch (err) {
      this.handleError(err)
    }
  }

  async logout(token: string) {
    try {
      const tokenService = getTokenService()

      await tokenService.removeToken(token)
    } catch (err) {
      this.handleError(err)
    }
  }
}

export const authService = new AuthService()
