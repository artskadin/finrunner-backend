export type ApiErrorType = CommonApiErrorType | BlockchainNetworkApiErrorType

export type BlockchainNetworkApiErrorType =
  | 'NETWORK_NOT_FOUND'
  | 'ALREADY_EXISTS'

export type CommonApiErrorType =
  | 'UNAUTHORIZED'
  | 'INVALID_ACCESS_TOKEN'
  | 'INVALID_REFRESH_TOKEN'
  | 'FORBIDDEN'
  | 'ALREADY_EXISTS'
  | 'INVALID_ID'
  | 'USER_NOT_FUOND'
  | 'USER_BY_USER_ID_NOT_FOUND'
  | 'TG_USERNAME_NOT_FUOND'
  | 'TG_ID_NOT_FUOND'
  | 'OTP_CODES_NOT_MATCH'
