import shedule from 'node-schedule'
import { cryptoAssetService } from './crypto-asset-service'
import { redisService } from './redis-service'
import { byBitExchangeService } from './exchanges/by-bit-exchange-service'
import { TickerData } from '../schemas/bybit-tickers-schema'
import { env } from '../envSettings/env'

const FETCH_INTERVAL_SECONDS =
  parseInt(env.MARKET_DATA_FETCH_INTERVAL_SECONDS) || 30
const REDIS_TICKER_EXPIRY_SECONDS =
  parseInt(env.MARKET_DATA_REDIS_EXPIRY_SECONDS) || 60

/**
 * Сервис для периодического получения текущих цен на бирже ByBit,
 * хранения этих данных в Redis и получение по запросу.
 */
class MarketDataService {
  private job: shedule.Job | null = null
  private isFetching = false
  private pairsToWatch: string[] = []

  constructor() {
    console.log('MarketDataService instance created')
  }

  public async start() {
    if (this.job) {
      return
    }

    await this.updatePairsToWatch()

    if (this.pairsToWatch.length === 0) {
      return
    }

    this.fetchAndStoreTickers().catch((err) =>
      console.error(`Failed to initial fetch tickers: ${err}`)
    )

    this.job = shedule.scheduleJob(
      `*/${FETCH_INTERVAL_SECONDS} * * * * *`,
      this.runScheduledFetch
    )
  }

  private runScheduledFetch = async (): Promise<void> => {
    if (this.isFetching) {
      return
    }

    this.isFetching = true

    try {
      await this.updatePairsToWatch()

      await this.fetchAndStoreTickers()
    } catch (err) {
      console.error('MarketDataService: Error during scheduled fetch:', err)
    } finally {
      this.isFetching = false
    }
  }

  public stop(): void {
    if (this.job) {
      this.job.cancel()
      this.job = null

      console.log('MarketDataService: Scheduled job stopped.')
    }
  }

  private async updatePairsToWatch(): Promise<void> {
    try {
      const assets = await cryptoAssetService.getCryptoAssets()

      if (!assets || assets.length === 0) {
        this.pairsToWatch = []
        return
      }

      const targetTickerSymbols = new Set<string>()

      for (const asset of assets) {
        if (['USDT'].includes(asset.currency.shortname)) {
          continue
        }

        targetTickerSymbols.add(`${asset.currency.shortname}USDT`)
      }

      this.pairsToWatch = Array.from(targetTickerSymbols)
    } catch (err) {
      console.log(`Failed to update pairs to watch.`, err)
    }
  }

  private async fetchAndStoreTickers(): Promise<void> {
    if (this.pairsToWatch.length === 0) {
      return
    }

    const tickers = await byBitExchangeService.getSpotTickers(this.pairsToWatch)

    if (!tickers) {
      return
    }

    const tickersToSave: Record<string, TickerData> = {}

    for (const ticker of tickers) {
      const symbol = ticker.symbol.toUpperCase()

      if (
        this.isValidPrice(ticker.bid1Price) &&
        this.isValidPrice(ticker.ask1Size)
      ) {
        tickersToSave[symbol] = {
          bid: ticker.bid1Price,
          ask: ticker.ask1Price,
          timestamp: Date.now()
        }
      }
    }

    await redisService.saveMultipleTickes({
      tickers: tickersToSave,
      expirySeconds: REDIS_TICKER_EXPIRY_SECONDS
    })
  }

  public async getLatestRate({
    baseAsset,
    quoteAsset,
    priceType
  }: {
    baseAsset: string
    quoteAsset: string
    priceType: 'bid' | 'ask'
  }): Promise<string | null> {
    const directSymbol = `${baseAsset.toUpperCase()}${quoteAsset.toUpperCase()}`

    try {
      let ticker = await redisService.getTickerData(directSymbol)

      if (ticker && this.isTickerDataFresh(ticker)) {
        return ticker[priceType]
      }

      return null
    } catch (err) {
      console.error(
        `MarketDataService: Error getting rate for ${directSymbol}. ${err}`
      )

      return null
    }
  }

  private isValidPrice(price: string | null | undefined): boolean {
    if (!price) {
      return false
    }
    const num = parseFloat(price)

    return !isNaN(num) && num > 0
  }

  private isTickerDataFresh(ticker: TickerData): boolean {
    const maxAge = REDIS_TICKER_EXPIRY_SECONDS * 1000

    return Date.now() - ticker.timestamp <= maxAge
  }
}

let marketDataServiceInstance: MarketDataService | null = null

export function initializeMarketDataService(): MarketDataService {
  if (!marketDataServiceInstance) {
    marketDataServiceInstance = new MarketDataService()

    marketDataServiceInstance
      .start()
      .catch((err) => console.error('Failed to start MarketDataService', err))
  } else {
    console.warn('MarketDataService already initialized')
  }

  return marketDataServiceInstance
}

export function getMarketDataService(): MarketDataService {
  if (!marketDataServiceInstance) {
    throw new Error('MarketDataService has not been initialized')
  }

  return marketDataServiceInstance
}
