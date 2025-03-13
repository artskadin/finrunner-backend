import { PrismaClient } from '@prisma/client'

class TokenRepository {
  prisma = new PrismaClient()

  async saveToken(payload: {
    userId: string
    refreshToken: string
    expiresAt: Date
  }) {
    try {
      const token = await this.prisma.jWTToken.create({ data: payload })
      return token
    } catch (err) {
      throw new Error(`Failed to create JWT for user ${payload.userId}. ${err}`)
    }
  }

  async removeToken(refreshToken: string) {
    try {
      const removedToken = await this.prisma.jWTToken.delete({
        where: { refreshToken }
      })
      return removedToken
    } catch (err) {
      throw new Error(`Failed to remove JWT ${refreshToken}. ${err}`)
    }
  }

  async getToken(refreshToken: string) {
    try {
      return await this.prisma.jWTToken.findUnique({
        where: { refreshToken }
      })
    } catch (err) {
      throw new Error(`Failed to get JWT ${refreshToken}. ${err}`)
    }
  }
}

export const tokenRepository = new TokenRepository()
