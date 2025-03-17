import { FastifyReply, FastifyRequest } from 'fastify'
import { GetUserByIdInput, GetUserByTgIdInput } from '../schemas/user-schema'
import { userService } from '../services/user-service'
import { ApiError } from '../exceptions/api-error'

class UserController {
  async getUserById(
    req: FastifyRequest<{
      Params: GetUserByIdInput
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params
      const user = await userService.getUserById(id)

      if (!user) {
        throw ApiError.UserByUserIdNotFound(id)
      }

      reply.status(200).send(user)
    } catch (err) {
      throw err
    }
  }

  async getUserByTelegramId(
    req: FastifyRequest<{
      Params: GetUserByTgIdInput
    }>,
    reply: FastifyReply
  ) {
    try {
      const { telegramId } = req.params
      const user = await userService.getUserByTgId(telegramId)

      if (!user) {
        throw ApiError.TelegramIdNotFound(telegramId)
      }

      reply.status(200).send(user)
    } catch (err) {
      throw err
    }
  }

  async getUsers(req: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await userService.getAllUsers()

      reply.status(200).send(users)
    } catch (err) {
      throw err
    }
  }
}

export const userController = new UserController()
