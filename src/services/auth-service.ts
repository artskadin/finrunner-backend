import { userRepository } from '../repositories/user-repository'

class AuthService {
  async getOtp(tgUsername: string) {
    try {
      const user = await userRepository.getUserByTgUsername(tgUsername)

      if (user) {
      }
    } catch (err) {
      throw err
    }
  }
}

export const authService = new AuthService()
