import { FastifyReply, FastifyRequest } from 'fastify'
import { OtpInput } from '../schemas/auth-schema'
import { userService } from '../services/user-service'
import { authService } from '../services/auth-service'

class AuthController {
  async getOtp(req: FastifyRequest<{ Body: OtpInput }>, reply: FastifyReply) {
    try {
      const { telegramUsername } = req.body
      const result = await authService.getOtp(telegramUsername)
      reply.status(200).send({ message: 'Code was sent via teelgram bot' })
    } catch (err) {
      reply.status(500).send({ error: 'Internal server error' })
    }
  }

  authorize() {}

  logout() {}
}

export const authController = new AuthController()
