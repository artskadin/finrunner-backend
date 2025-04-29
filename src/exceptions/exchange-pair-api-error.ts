import { ApiError } from './api-error'
import { ExchangePairApiErrorType } from '../schemas/api-error-schema'

export class ExchangePairApiError extends ApiError {
  public type: ExchangePairApiErrorType

  constructor(
    status: number,
    type: ExchangePairApiErrorType,
    message: string,
    details?: string
  ) {
    super(status, type, message, details)
    this.type = type
  }

  public static OnlyFromCryptoOrFromFiat() {
    return new ExchangePairApiError(
      400,
      'SHOULD_ONLY_BE_FROM_FIAT_OR_FROM_CRYPTO',
      'There should only be fromCrypto or fromFiat asset'
    )
  }

  public static OnlyToCryptoOrToFiat() {
    return new ExchangePairApiError(
      400,
      'SHOULD_ONLY_BE_TO_FIAT_OR_TO_CRYPTO',
      'There should only be toCrypto or toFiat asset'
    )
  }
}
