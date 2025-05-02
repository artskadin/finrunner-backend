import { ExchangeApiErrorType } from '../schemas/api-error-schema'
import { ApiError } from './api-error'

export class ExchangeApiError extends ApiError {
  public type: ExchangeApiErrorType

  constructor(
    status: number,
    type: ExchangeApiErrorType,
    message: string,
    details?: string
  ) {
    super(status, type, message, details)
    this.type = type
  }

  public static ExchangePairNotFound(pairId?: string) {
    return new ExchangeApiError(
      404,
      'EXCHANGE_PAIR_NOT_FOUND',
      pairId
        ? `Exchange pair with id ${pairId} not found`
        : 'Exchange pair not found'
    )
  }

  public static InactiveExchangePair(pairId: string) {
    return new ExchangeApiError(
      404,
      'INACTIVE_EXCHANGE_PAIR',
      `Exchange pair with id ${pairId} is not active`
    )
  }

  public static CouldNotDetermineCurrency() {
    return new ExchangeApiError(
      404,
      'COULD_NOT_DETERMINE_CURRENCY',
      `Could not determine currency`
    )
  }

  public static MarketRateNotAvailable() {
    return new ExchangeApiError(
      404,
      'MARKET_RATE_NOT_AVAILABLE',
      'Market rate not available'
    )
  }

  public static FailedFetchAssets(assetType: 'crypto' | 'fiat') {
    if (assetType === 'crypto') {
      return new ExchangeApiError(
        404,
        'FAILED_TO_FETCH_CRYPTO_ASSETS',
        'Failed to fetch crypto asset'
      )
    } else {
      return new ExchangeApiError(
        404,
        'FAILED_TO_FETCH_FIAT_ASSETS',
        'Failed to fetch fiat asset'
      )
    }
  }
}
