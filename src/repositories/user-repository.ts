import { PrismaClient, User, Prisma } from '@prisma/client'

class UserRepository {
  prisma = new PrismaClient()

  async createUser(user: Prisma.UserCreateInput): Promise<User> {
    try {
      const createdUser = await this.prisma.user.create({ data: user })

      return createdUser
    } catch (err) {
      throw new Error(
        `Failed to create user [telegramId: ${user.telegramId}]. ${JSON.stringify(err)}`
      )
    }
  }

  async updateUser(id: string, user: Prisma.UserUpdateInput): Promise<User> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: user
      })

      return updatedUser
    } catch (err) {
      throw new Error(`Failed to update user [id: ${user.id}]`)
    }
  }

  async getUserById(id: User['id']) {
    try {
      return await this.prisma.user.findUnique({ where: { id } })
    } catch (err) {
      console.error(`Failed to fetch user by id ${id}`)
      throw new Error(`Failed to fetch user by telegramUsername ${id}`)
    }
  }

  async getUserByTgUsername(
    telegramUsername: User['telegramUsername']
  ): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({ where: { telegramUsername } })
    } catch (err) {
      console.error(err)
      throw new Error(
        `Failed to fetch user by telegramUsername ${telegramUsername}`
      )
    }
  }

  async getUserByTelegramId(
    telegramId: User['telegramId']
  ): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({ where: { telegramId } })
    } catch (err) {
      console.error(err)
      throw new Error(`Failed to fetch user by telegramId ${telegramId}`)
    }
  }

  async getAllUsers(): Promise<User[] | null> {
    try {
      return await this.prisma.user.findMany()
    } catch (err) {
      throw new Error(`Failed to fetch users. Err: ${err}`)
    }
  }
}

export const userRepository = new UserRepository()
