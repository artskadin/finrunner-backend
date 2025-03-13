import { User, Prisma } from '@prisma/client'
import { userRepository } from '../repositories/user-repository'

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

  async getUserById(id: string) {
    try {
      return await userRepository.getUserById(id)
    } catch (err) {
      throw err
    }
  }

  async getUserByTgUsername(tgUsername: string) {
    try {
      return await userRepository.getUserByTgUsername(tgUsername)
    } catch (err) {
      throw err
    }
  }

  async getUserByTgId(tgId: string): Promise<User | null> {
    try {
      return await userRepository.getUserByTelegramId(tgId)
    } catch (err) {
      throw err
    }
  }

  async getAllUsers(): Promise<User[] | null> {
    try {
      return await userRepository.getAllUsers()
    } catch (err) {
      throw err
    }
  }
}

export const userService = new UserService()
