export type Wallet = {
  privateKey: string
  publicKey: string
  address: string
}

export type BlockchainType = 'mainnet' | 'testnet'

export type BlockchainConfig = {
  chainType: BlockchainType
  apiKey: string
  rpcUrl: string
}
