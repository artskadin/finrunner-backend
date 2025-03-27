import { Wallet } from '../types'

export interface BlockchainAdapter {
  createWallet(): Promise<Wallet>
  getWalletBalance(walletAddress: string): Promise<any>
  getWalletTransactions(): Promise<any>
  getWalletInfo(): Promise<any>
  getTransactionInfo(): Promise<any>
  sendTransaction(): Promise<any>
  subscribeToWalletEvents(): Promise<any>
}
