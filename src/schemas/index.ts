import {
  userSchema,
  registrationSchema,
  getUserByIdSchema,
  getUserByTgIdSchema
} from './user-schema'
import {
  otpSchema,
  jwtTokenSchema,
  authorizeSchema,
  authorizeResponseSchema
} from './auth-schema'
import {
  apiErrorTypeSchema,
  apiErrorResponseSchema,
  validationErrorResponseSchema,
  internalServerErrorResponseSchema
} from './api-error-schema'
import {
  bidSchema,
  createBidSchema,
  bidQueryParamsSchema,
  getBidByIdSchema,
  getBidsResponseSchema,
  updateBidBodySchema
} from './bid-schema'
import {
  availableBlockchainNetworksSchema,
  blockchainNetworkSchema,
  createBlockchainNetworkSchema,
  deleteBlockchainNetworkParamsSchema,
  getblockchainNetworkByIdSchema,
  updateBlockchainNetworkBodySchema,
  updateBlockchainNetworkParamsSchema
} from './blockchain-network-schema'
import {} from './crypto-wallet-schema'
import {
  createCurrencySchema,
  currencySchema,
  deleteCurrencySchema,
  getCurrencyByIdSchema,
  updateCurrencyBodySchema,
  updateCurrencyParamsSchema
} from './currency-schema'
import {
  createExchangePairSchema,
  deleteExchangePairSchema,
  exchangePairSchema,
  exchangePairSchemaResponse,
  getExchangePairByIdSchema,
  updateExchangePairBodySchema,
  updateExchangePairParamsSchema
} from './exchange-pair-schema'
import {} from './general-schemas'
import {} from './payment-schema'
import {
  createCryptoAssetSchema,
  cryptoAssetSchema,
  deleteCryptoAssetParamsSchema,
  getCryptoAssetByIdSchema,
  updateCryptoAssetBodySchema,
  updateCryptoAssetParamsSchema
} from './crypto-asset-schema'

export const schemas = {
  //user-schema
  userSchema,
  registrationSchema,
  getUserByIdSchema,
  getUserByTgIdSchema,

  //auth-schema
  otpSchema,
  jwtTokenSchema,
  authorizeSchema,
  authorizeResponseSchema,

  //bid-schema
  bidSchema,
  createBidSchema,
  bidQueryParamsSchema,
  getBidByIdSchema,
  getBidsResponseSchema,
  updateBidBodySchema,

  //api-error-schema
  apiErrorTypeSchema,
  apiErrorResponseSchema,
  validationErrorResponseSchema,
  internalServerErrorResponseSchema,

  //currency-schema
  currencySchema,
  createCurrencySchema,
  getCurrencyByIdSchema,
  updateCurrencyBodySchema,
  updateCurrencyParamsSchema,
  deleteCurrencySchema,

  //blockchain-network-schema
  blockchainNetworkSchema,
  availableBlockchainNetworksSchema,
  createBlockchainNetworkSchema,
  getblockchainNetworkByIdSchema,
  updateBlockchainNetworkParamsSchema,
  updateBlockchainNetworkBodySchema,
  deleteBlockchainNetworkParamsSchema,

  //crypto-asset-schemas
  cryptoAssetSchema,
  createCryptoAssetSchema,
  getCryptoAssetByIdSchema,
  updateCryptoAssetParamsSchema,
  updateCryptoAssetBodySchema,
  deleteCryptoAssetParamsSchema,

  //exchange-paris-schemas
  exchangePairSchema,
  exchangePairSchemaResponse,
  createExchangePairSchema,
  getExchangePairByIdSchema,
  updateExchangePairParamsSchema,
  updateExchangePairBodySchema,
  deleteExchangePairSchema
}
