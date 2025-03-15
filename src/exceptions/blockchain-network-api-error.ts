import { ApiError } from './api-error'
import { BlockchainNetworkApiErrorType } from './error-types'

//УДАЛИТЬ???
export class BlockchainNetworkApiError extends ApiError {
  public type: BlockchainNetworkApiErrorType

  constructor(
    status: number,
    type: BlockchainNetworkApiErrorType,
    message: string,
    details?: string
  ) {
    super(status, type, message, details)
    this.type = type
  }

  public static NetworkNotFound(networkId: string) {
    return new BlockchainNetworkApiError(
      404,
      'NETWORK_NOT_FOUND',
      `Blockchain network with id ${networkId} not found`
    )
  }

  public static NetworkAlreadyExists(prop: string) {
    return new BlockchainNetworkApiError(
      400,
      'ALREADY_EXISTS',
      `Blockchain network with property '${prop}' already exists`
    )
  }
}
