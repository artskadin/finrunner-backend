import { RestClientV5 } from 'bybit-api'
import { env } from '../../envSettings/env'

class ByBitExchangeService {
  private client: RestClientV5

  constructor() {
    this.client = new RestClientV5({
      testnet: false,
      baseUrl: env.BYBIT_API_BASE_URL,
      key: env.BYBIT_API_KEY,
      secret: env.BYBIT_API_SECRET
    })
  }

  async getSpotTickers(symbols?: string[]) {
    try {
      const response = await this.client.getTickers({ category: 'spot' })

      if (response.retCode !== 0 || response.retMsg !== 'OK') {
        throw new Error('Failed to fetch tickers from ByBit')
      }

      const allTickerSymbols = response.result.list

      if (!symbols) {
        return allTickerSymbols
      }

      const filteredTickers = allTickerSymbols.filter((symbol) =>
        symbols.includes(symbol.symbol)
      )

      return filteredTickers
    } catch (err) {
      console.error(`Error fetching tickers from ByBit: ${err}`)

      return null
    }
  }
}

export const byBitExchangeService = new ByBitExchangeService()
