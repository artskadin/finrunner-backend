import { createWalletClient, formatEther, Hex, http, publicActions } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { mainnet, holesky } from 'viem/chains'
import { BlockchainAdapter } from './blockchain-adapter'
import { BlockchainConfig, Wallet } from '../types'

export class EthereumAdapter implements BlockchainAdapter {
  private client

  constructor(config: BlockchainConfig) {
    const chain = config.chainType === 'mainnet' ? mainnet : holesky
    const rpcUrl = `${config.rpcUrl}${config.apiKey}`

    this.client = createWalletClient({
      chain,
      transport: http(rpcUrl)
    }).extend(publicActions)
  }

  async createWallet(): Promise<Wallet> {
    const privateKey = generatePrivateKey()
    const account = privateKeyToAccount(privateKey)

    const result = {
      privateKey,
      publicKey: account.publicKey,
      address: account.address
    }

    return result
  }

  async getWalletBalance(walletAddress: Hex): Promise<any> {
    const wei = await this.client.getBalance({ address: walletAddress })
    const ether = formatEther(wei)

    return ether
  }
  getWalletTransactions(): Promise<any> {
    throw new Error('Method not implemented.')
  }
  getWalletInfo(): Promise<any> {
    throw new Error('Method not implemented.')
  }
  getTransactionInfo(): Promise<any> {
    throw new Error('Method not implemented.')
  }
  sendTransaction(): Promise<any> {
    throw new Error('Method not implemented.')
  }
  subscribeToWalletEvents(): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
