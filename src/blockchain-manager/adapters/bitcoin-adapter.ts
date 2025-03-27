import { Wallet } from '../types'
import { BlockchainAdapter } from './blockchain-adapter'

export class BitcoinAdapter implements BlockchainAdapter {
  createWallet(): Promise<Wallet> {
    throw new Error('Method not implemented.')
  }
  getWalletBalance(): Promise<any> {
    throw new Error('Method not implemented.')
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
