import Redis from 'ioredis'
import { Envs } from '../envSettings'

class RedisService {
  private static instance: RedisService | null = null
  private client: Redis

  constructor(envs: Envs) {
    this.client = new Redis({
      host: envs.REDIS_HOST || 'localhost',
      port: parseInt(envs.REDIS_PORT || '6379')
    })
    console.log('Redis connected')
  }

  public static getInstance(envs?: Envs) {
    if (!RedisService.instance) {
      if (!envs) {
        throw new Error('Envs must be provided to initialize the RedisService')
      }
      RedisService.instance = new RedisService(envs)
    }

    return RedisService.instance
  }

  async saveOtpCode({
    tgId,
    otpCode
  }: {
    tgId: string
    otpCode: string
  }): Promise<void> {
    await this.client.set(`otpTgId:${tgId}`, otpCode, 'EX', 180)
  }

  async getOtpCode(tgId: string): Promise<string | null> {
    return this.client.get(`otpTgId:${tgId}`)
  }

  async deleteOtpCode(tgId: string): Promise<void> {
    this.client.del(`otpTgId:${tgId}`)
  }
}

export const getRedisService = (envs?: Envs) => RedisService.getInstance(envs)
