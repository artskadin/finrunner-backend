import { FastifyReply, FastifyRequest } from 'fastify'
import { GetUserByTgIdInput, RegistrationInput } from '../schemas/user-schema'
import { userService } from '../services/user-service'

class UserController {
  registration(
    req: FastifyRequest<{
      Body: RegistrationInput
    }>,
    reply: FastifyReply
  ) {
    const data = req.body
    userService.registration(data)
  }

  // login() {}

  // logout() {}

  // refresh() {}

  async getUserByTelegramId(
    req: FastifyRequest<{
      Params: GetUserByTgIdInput
    }>,
    reply: FastifyReply
  ) {
    const data = req.params
    const result = await userService.getUserByTgId(data.telegramId)

    reply.send(result)
  }

  getAllUsers() {}
}

export const userController = new UserController()
