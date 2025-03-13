import jwt from 'jsonwebtoken'
import { JWTTokenInput } from '../schemas/auth-schema'
import { Envs } from '../envSettings'
import { tokenRepository } from '../repositories/token-repository'

class TokenService {
  private static instance: TokenService | null = null
  private jWTAccessSecret: string
  private JWTRefreshSecret: string

  constructor(envs: Envs) {
    this.jWTAccessSecret = envs.JWT_ACCESS_SECRET
    this.JWTRefreshSecret = envs.JWT_REFRESH_SECRET
  }

  public static getInstance(envs?: Envs) {
    if (!TokenService.instance) {
      if (!envs) {
        throw new Error('Envs must be provided to initialize the TokenService')
      }
      TokenService.instance = new TokenService(envs)
    }

    return TokenService.instance
  }

  generateTokens(payload: JWTTokenInput) {
    try {
      const prepared = { ...payload, telegramId: payload.telegramId.toString() }

      const accessToken = jwt.sign(prepared, this.jWTAccessSecret, {
        expiresIn: '20m'
      })
      const refreshToken = jwt.sign(prepared, this.JWTRefreshSecret, {
        expiresIn: '7d'
      })

      return { accessToken, refreshToken }
    } catch (err) {
      throw err
    }
  }

  async findToken(token: string) {
    try {
      const tokenData = await tokenRepository.getToken(token)

      return tokenData
    } catch (err) {
      throw err
    }
  }

  async saveToken(payload: { userId: string; refreshToken: string }) {
    try {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      return await tokenRepository.saveToken({ ...payload, expiresAt })
    } catch (err) {
      throw err
    }
  }

  async removeToken(token: string) {
    try {
      const tokenData = await tokenRepository.getToken(token)

      if (!tokenData) {
        return
      }

      const removedToken = await tokenRepository.removeToken(token)

      return removedToken
    } catch (err) {
      throw err
    }
  }

  validateAccessToken(token: string) {
    try {
      const data = jwt.verify(token, this.jWTAccessSecret) as JWTTokenInput
      return data
    } catch (err) {
      return null
    }
  }

  validateRefreshToken(token: string) {
    try {
      const data = jwt.verify(token, this.JWTRefreshSecret) as JWTTokenInput
      return data
    } catch (err) {
      return null
    }
  }
}

export const getTokenService = (envs?: Envs) => TokenService.getInstance(envs)
