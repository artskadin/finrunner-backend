import Redis from 'ioredis'
import { env } from '../envSettings/env'
import { TickerData } from '../schemas/bybit-tickers-schema'

const TICKER_PREFIX = 'market:ticker:'
const OTP_PREFIX = 'otpTgId:'
const OTP_EXPIRY_SECONDS = 180

class RedisService {
  private readonly client: Redis
  private isConnecting: boolean = false
  private isConnected: boolean = false
  private connectionPromise: Promise<void> | null = null

  constructor() {
    this.client = new Redis({
      host: env.REDIS_HOST,
      port: parseInt(env.REDIS_PORT),
      maxRetriesPerRequest: 3,
      lazyConnect: true
    })

    this.setupListeners()
  }

  private setupListeners() {
    this.client.on('connect', () => {
      console.log('Redis client connected successfully')
    })

    this.client.on('ready', () => {
      console.log('Redis client ready to process commands')
      this.isConnected = true
      this.isConnecting = false
    })

    this.client.on('error', (error) => {
      console.error('Redis client error:', error)
      this.isConnected = false
      this.isConnecting = false
    })

    this.client.on('close', () => {
      console.warn('Redis client connection closed')
      this.isConnected = false
      this.isConnecting = false
    })

    this.client.on('end', () => {
      console.warn('Redis client connection ended')
      this.isConnected = false
      this.isConnecting = false
      this.connectionPromise = null
    })
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      return
    }

    if (this.isConnecting) {
      return this.connectionPromise!
    }

    console.log('Connecting to Redis...')
    this.isConnecting = true

    this.connectionPromise = new Promise((res, rej) => {
      const onError = (error: Error) => {
        this.client.removeListener('ready', onReady)
        this.client.removeListener('error', onError)
        this.isConnecting = false
        this.connectionPromise = null

        console.error('Redis connection failed during initial connect.', error)

        rej(error)
      }
      const onReady = () => {
        this.client.removeListener('ready', onReady)
        this.client.removeListener('error', onError)
        this.connectionPromise = null

        res()
      }

      this.client.once('ready', onReady)
      this.client.once('error', onError)

      this.client.connect().catch(onError)
    })

    return this.connectionPromise
  }

  public async disconnect(): Promise<void> {
    if (this.client && this.client.status !== 'end') {
      console.log('Disconnecting from Redis...')
      await this.client.quit()
    }
    this.isConnected = false
    this.isConnecting = false
    this.connectionPromise = null
  }

  private async ensureConnected(): Promise<void> {
    if (!this.isConnected && !this.isConnecting) {
      await this.connect()
    }

    if (this.isConnecting) {
      await this.connectionPromise
    }
  }

  async saveOtpCode({
    tgId,
    otpCode
  }: {
    tgId: string
    otpCode: string
  }): Promise<void> {
    await this.ensureConnected()

    const key = `${OTP_PREFIX}${tgId}`
    try {
      await this.client.setex(key, OTP_EXPIRY_SECONDS, otpCode)
    } catch (err) {
      throw err
    }
  }

  async getOtpCode(tgId: string): Promise<string | null> {
    await this.ensureConnected()

    const key = `${OTP_PREFIX}${tgId}`

    try {
      return await this.client.get(key)
    } catch (err) {
      console.error(`Failed to get OTP code for tgId ${tgId}: ${err}`)
      return null
    }
  }

  async deleteOtpCode(tgId: string): Promise<void> {
    await this.ensureConnected()

    const key = `${OTP_PREFIX}${tgId}`
    try {
      await this.client.del(key)
    } catch (err) {
      console.error(`Failed to delete OTP code for tgId ${tgId}: ${err}`)
    }
  }

  async saveTickerData({
    symbol,
    data,
    expirySeconds
  }: {
    symbol: string
    data: TickerData
    expirySeconds: number
  }): Promise<void> {
    await this.ensureConnected()

    const key = `${TICKER_PREFIX}${symbol.toUpperCase()}`

    try {
      await this.client.setex(key, expirySeconds, JSON.stringify(data))
    } catch (err) {
      console.log(`Failed to save ticker data for symbol ${symbol}: ${err}`)
    }
  }

  async saveMultipleTickes({
    tickers,
    expirySeconds
  }: {
    tickers: Record<string, TickerData>
    expirySeconds: number
  }): Promise<void> {
    await this.ensureConnected()

    if (Object.keys(tickers).length === 0) {
      return
    }

    try {
      const pipeLine = this.client.pipeline()

      for (const symbol in tickers) {
        const key = `${TICKER_PREFIX}${symbol.toUpperCase()}`

        pipeLine.setex(key, expirySeconds, JSON.stringify(tickers[symbol]))
      }

      await pipeLine.exec()
    } catch (err) {
      console.error(`Failed to save multiple tickers: ${err}`)
    }
  }

  async getTickerData(symbol: string): Promise<TickerData | null> {
    await this.ensureConnected()

    const key = `${TICKER_PREFIX}${symbol.toUpperCase()}`

    try {
      const data = await this.client.get(key)

      return data ? (JSON.parse(data) as TickerData) : null
    } catch (err) {
      console.log(`Failed to get ticker data for symbol ${symbol}: ${err}`)

      return null
    }
  }

  getClient(): Redis {
    return this.client
  }
}

export const redisService = new RedisService()
