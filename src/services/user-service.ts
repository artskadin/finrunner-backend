import { User, Prisma } from '@prisma/client'
import { userRepository } from '../repositories/user-repository'
import { OtpInput } from '../schemas/auth-schema'
import { RegistrationInput } from '../schemas/user-schema'

class UserService {
  async createUser(user: Prisma.UserCreateInput): Promise<User> {
    try {
      return await userRepository.createUser(user)
    } catch (err) {
      throw err
    }
  }

  async updateUser(id: string, user: Prisma.UserUpdateInput): Promise<User> {
    try {
      return await userRepository.updateUser(id, user)
    } catch (err) {
      throw err
    }
  }

  async registration(data: RegistrationInput) {
    // await userRepository.getUserByTelegramId(data.)
    // await userRepository.createUser(data)
  }

  login() {}

  logout() {}

  refresh() {}

  getUserById() {}

  async getUserByTgUsername(tgUsername: string) {
    try {
      const user = await userRepository.getUserByTgUsername(tgUsername)
    } catch (err) {
      // throw new Error(err.message)
    }
  }

  async getUserByTgId(tgId: bigint): Promise<User | null> {
    try {
      return await userRepository.getUserByTelegramId(tgId)
    } catch (err) {
      console.error(err)
      throw new Error(`Failed to get user by telegramId ${tgId}`)
    }
  }

  getAllUsers() {}
}

export const userService = new UserService()
