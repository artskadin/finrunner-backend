import { FastifyReply, FastifyRequest } from 'fastify'
import {
  OtpInput,
  AuthorizeInput,
  AuthorizeResponse
} from '../schemas/auth-schema'
import { authService } from '../services/auth-service'
import { ApiError } from '../exceptions/api-error'

class AuthController {
  async getOtp(req: FastifyRequest<{ Body: OtpInput }>, reply: FastifyReply) {
    try {
      const { telegramUsername } = req.body
      const result = await authService.getOtp(telegramUsername)

      reply.status(200).send({ message: 'Code was sent via telegram bot' })
    } catch (err) {
      throw err
    }
  }

  async authorize(
    req: FastifyRequest<{ Body: AuthorizeInput }>,
    reply: FastifyReply
  ) {
    try {
      const { telegramUsername, otpCode } = req.body

      const userData = await authService.authorize({
        telegramUsername,
        otpCode
      })

      if (!userData) {
        return
      }

      const { user, accessToken, refreshToken } = userData

      const response: AuthorizeResponse = {
        message: 'Authorized successfully',
        id: user.id,
        accessToken
      }

      reply
        .setCookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 604800
        })
        .status(200)
        .send(response)
    } catch (err) {
      throw err
    }
  }

  async refresh(req: FastifyRequest, reply: FastifyReply) {
    try {
      const token = req.cookies.refreshToken

      if (!token) {
        throw ApiError.Unauthorized()
      }

      const tokenData = await authService.refresh(token)

      if (!tokenData) {
        return
      }

      const { userId, accessToken, refreshToken } = tokenData

      const response: AuthorizeResponse = {
        message: 'Token refreshed successfully',
        id: userId,
        accessToken
      }

      reply
        .setCookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 604800
        })
        .status(200)
        .send(response)
    } catch (err) {
      throw err
    }
  }

  async logout(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { refreshToken } = req.cookies

      if (!refreshToken) {
        throw ApiError.Unauthorized()
      }

      await authService.logout(refreshToken)

      reply
        .clearCookie('refreshToken', {
          httpOnly: true,
          secure: true,
          sameSite: 'strict'
        })
        .status(200)
        .send({ message: 'Logout successfully' })
    } catch (err) {
      throw err
    }
  }
}

export const authController = new AuthController()
