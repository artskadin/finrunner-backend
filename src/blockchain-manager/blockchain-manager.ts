import { BitcoinAdapter } from './adapters/bitcoin-adapter'
import { BlockchainAdapter } from './adapters/blockchain-adapter'
import { EthereumAdapter } from './adapters/ethereum-adapter'
import { BlockchainConfig, BlockchainType } from './types'

export enum Blockchain {
  BITCOIN = 'BITCOIN',
  ETHEREUM = 'ETHEREUM',
  SOLANA = 'SOLANA'
  // TRON = 'TRON',
  // LITECOIN = 'LITECOIN'
}

export class BlockchainManager {
  private adapters: Map<Blockchain, BlockchainAdapter>
  public readonly client: BlockchainType = 'testnet'

  constructor(config: BlockchainConfig) {
    this.client = config.chainType
    this.adapters = new Map()
    this.adapters.set(Blockchain.BITCOIN, new BitcoinAdapter())
    this.adapters.set(Blockchain.ETHEREUM, new EthereumAdapter(config))
  }

  private getAdapter(blockchain: Blockchain): BlockchainAdapter {
    const adapter = this.adapters.get(blockchain)

    if (!adapter) {
      throw new Error(`Unsupported blockchain: ${blockchain}`)
    }

    return adapter
  }

  async createWallet(blockchain: Blockchain) {
    try {
      if (blockchain in Blockchain) {
        return this.getAdapter(blockchain).createWallet()
      }

      throw new Error(`Unsupport blockchain network '${blockchain}'.`)
    } catch (err) {
      throw err
    }
  }

  async getWalletBalance(blockchain: Blockchain, walletAddress: string) {
    return this.getAdapter(blockchain).getWalletBalance(walletAddress)
  }
}
