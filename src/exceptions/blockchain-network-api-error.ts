import { BlockchainNetworkApiErrorType } from '../schemas/api-error-schema'
import { ApiError } from './api-error'

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
    return new ApiError(
      400,
      'ALREADY_EXISTS',
      `Blockchain network with property '${prop}' already exists`
    )
  }

  public static InvalidBlockchainNetworkName(networkName: string) {
    return new BlockchainNetworkApiError(
      400,
      'INVALID_BLOCKCHAIN_NETWORK_NAME',
      `Invalid blockchain network name '${networkName}'`
    )
  }
}
