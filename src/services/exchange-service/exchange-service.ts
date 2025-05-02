import Decimal from 'decimal.js'
import {
  AvailablePairsParams,
  QuoteParams,
  QuoteResponse,
  RateInfo
} from './types'
import { ExchangeApiError } from '../../exceptions/exchange-api-error'
import { cryptoAssetRepository } from '../../repositories/crypto-asset-repository'
import { exchangePairsRepository } from '../../repositories/exchange-pair-repository'
import { fiatAssetRepository } from '../../repositories/fiat-asset-repository'
import { BaseService } from '../base-service'
import { getMarketDataService } from '../market-data-service'

/**
 * Сервис для получения курса стоимости активов для клиентов
 */
class ExchangeService extends BaseService {
  private readonly QUOTE_ASSETS = ['USDT', 'USDC', 'DAI', 'USD', 'EUR', 'RUB']

  constructor() {
    super()
  }

  private isQuoteAsset(symbol: string | undefined | null): boolean {
    if (!symbol) return false
    return this.QUOTE_ASSETS.includes(symbol.toUpperCase())
  }

  async getAssets() {
    const [cryptoAssetsResult, fiatAssetsResult] = await Promise.allSettled([
      cryptoAssetRepository.getCryptoAssets(),
      fiatAssetRepository.getFiatAssets()
    ])

    const cryptoAssets =
      cryptoAssetsResult.status === 'fulfilled'
        ? (cryptoAssetsResult.value ?? [])
        : []
    const fiatAssets =
      fiatAssetsResult.status === 'fulfilled'
        ? (fiatAssetsResult.value ?? [])
        : []

    return { cryptoAssets, fiatAssets }
  }

  async getAvailablePairs(params: AvailablePairsParams) {
    try {
      const { selectedAssetId, selectedAssetType, direction } = params

      let availableIds: { crypto: string[]; fiat: string[] }

      if (direction === 'from') {
        availableIds = await exchangePairsRepository.findAvailableToAssetIds({
          fromAssetId: selectedAssetId,
          fromAssetType: selectedAssetType
        })
      } else {
        availableIds = await exchangePairsRepository.findAvailableFromAssetIds({
          toAssetId: selectedAssetId,
          toAssetType: selectedAssetType
        })
      }

      return { availableTargetAssetIds: availableIds }
    } catch (err) {
      this.handleError(err)
    }
  }

  async getQuote(params: QuoteParams): Promise<QuoteResponse> {
    try {
      const { fromAssetId, fromAssetType, toAssetId, toAssetType } = params

      const pair = await exchangePairsRepository.findPairByAssetIds({
        fromAssetId,
        fromAssetType,
        toAssetId,
        toAssetType
      })

      if (!pair) {
        throw ExchangeApiError.ExchangePairNotFound()
      }

      if (pair.status !== 'ACTIVE') {
        throw ExchangeApiError.InactiveExchangePair(pair.id)
      }

      const fromCurrencyShort =
        pair.fromCryptoAsset?.currency.shortname ??
        pair.fromFiatAsset?.currency.shortname
      const toCurrencyShort =
        pair.toCryptoAsset?.currency.shortname ??
        pair.toFiatAsset?.currency.shortname
      const markupPercentage = new Decimal(pair.markupPercentage)

      if (!fromCurrencyShort || !toCurrencyShort) {
        throw ExchangeApiError.CouldNotDetermineCurrency()
      }

      const finalRateDecimal = await this.calculateFinalRate({
        fromSymbol: fromCurrencyShort,
        toSymbol: toCurrencyShort,
        markupPercentage
      })

      let rateInfo: RateInfo
      const isFromQuote = this.isQuoteAsset(fromCurrencyShort)
      const isToQuote = this.isQuoteAsset(toCurrencyShort)

      if (!isFromQuote) {
        rateInfo = {
          fromAssetShortname: fromCurrencyShort,
          fromAssetAmount: '1',
          toAssetShortname: toCurrencyShort,
          toAssetAmount: finalRateDecimal.toFixed(6),
          timestamp: Date.now()
        }
      } else if (!isToQuote) {
        rateInfo = {
          fromAssetShortname: fromCurrencyShort,
          fromAssetAmount: new Decimal(1)
            .dividedBy(finalRateDecimal)
            .toFixed(6),
          toAssetShortname: toCurrencyShort,
          toAssetAmount: '1',
          timestamp: Date.now()
        }
      } else {
        rateInfo = {
          fromAssetShortname: fromCurrencyShort,
          fromAssetAmount: '1',
          toAssetShortname: toCurrencyShort,
          toAssetAmount: finalRateDecimal.toFixed(6),
          timestamp: Date.now()
        }
      }

      return {
        rate: rateInfo,
        minAmount: pair.minAmount.toString(),
        maxAmount: pair.maxAmount.toString()
      }
    } catch (err) {
      throw this.handleError(err)
    }
  }

  private async calculateFinalRate({
    fromSymbol,
    toSymbol,
    markupPercentage
  }: {
    fromSymbol: string
    toSymbol: string
    markupPercentage: Decimal
  }): Promise<Decimal> {
    try {
      const marketDataService = getMarketDataService()
      const from = fromSymbol.toUpperCase()
      const to = toSymbol.toUpperCase()

      if (from === to) {
        return new Decimal(1)
      }

      // Коэффициент наценки (например, 1.015 для 1.5% наценки)
      const markupMultiplier = new Decimal(1).plus(
        markupPercentage.dividedBy(100)
      )
      // Коэффициент скидки (например, 0.985 для 1.5% скидки/комиссии)
      const discountMultiplier = new Decimal(1).minus(
        markupPercentage.dividedBy(100)
      )

      const mainQuoteAsset = this.QUOTE_ASSETS[0]

      if (to === mainQuoteAsset && from !== mainQuoteAsset) {
        // Пример: BTC -> USDT. Клиент ПРОДАЕТ нам BTC. Мы покупаем по Bid(BTC/USDT).
        // Наш курс для клиента = Bid * (1 - markup/100) (мы даем меньше USDT за его BTC)
        const baseRateStr = await marketDataService.getLatestRate({
          baseAsset: from,
          quoteAsset: to,
          priceType: 'bid'
        })

        if (!baseRateStr) {
          throw ExchangeApiError.MarketRateNotAvailable()
        }

        const baseRate = new Decimal(baseRateStr)

        return baseRate.times(discountMultiplier)
      }

      if (from === mainQuoteAsset && to !== mainQuoteAsset) {
        // Пример: USDT -> BTC. Клиент КУПИЛ у нас BTC. Мы продаем по Ask(BTC/USDT).
        // Наш курс для клиента = Ask * (1 + markup/100) (мы даем больше USDT за его BTC)
        const baseRateStr = await marketDataService.getLatestRate({
          baseAsset: to,
          quoteAsset: from,
          priceType: 'ask'
        })

        if (!baseRateStr) {
          throw ExchangeApiError.MarketRateNotAvailable()
        }

        const baseRate = new Decimal(baseRateStr)

        if (baseRate.isZero()) {
          throw ExchangeApiError.InternalServerError(
            'Cannot divide by zero base rate'
          )
        }

        const finalAskPrice = baseRate.times(markupMultiplier)

        return new Decimal(1).dividedBy(finalAskPrice)
      }

      if (!this.isQuoteAsset(from) && !this.isQuoteAsset(to)) {
        const fromRateStr = await marketDataService.getLatestRate({
          baseAsset: from,
          quoteAsset: mainQuoteAsset,
          priceType: 'bid'
        })
        const toRateStr = await marketDataService.getLatestRate({
          baseAsset: to,
          quoteAsset: mainQuoteAsset,
          priceType: 'ask'
        })

        if (!fromRateStr || !toRateStr) {
          throw ExchangeApiError.MarketRateNotAvailable()
        }

        const fromRate = new Decimal(fromRateStr)
        const toRate = new Decimal(toRateStr)

        if (toRate.isZero()) {
          throw ExchangeApiError.InternalServerError(
            'Cannot divide by zero base rate'
          )
        }

        const baseCrossRate = fromRate.dividedBy(toRate)

        return baseCrossRate.times(discountMultiplier)
      }

      throw ExchangeApiError.InternalServerError()
    } catch (err) {
      throw this.handleError(err)
    }
  }
}

export const exchangeService = new ExchangeService()
