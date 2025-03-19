import { Prisma } from '@prisma/client'
import { cryptoWalletEncryptionKeyRepository } from '../repositories/cw-encryption-key-repository'

class CryptoWalletEncryptionKeyService {
  async createKey(key: Prisma.CryptoWalletEncryptionKeyUncheckedCreateInput) {
    try {
      return await cryptoWalletEncryptionKeyRepository.createKey({
        ...key,
        CryptoWallet: { connect: { id: key.cryptoWalletId } }
      })
    } catch (err) {
      throw err
    }
  }

  async getKeyById(id: string) {
    try {
      return await cryptoWalletEncryptionKeyRepository.getKeyById(id)
    } catch (err) {
      throw err
    }
  }

  async getKeysByCryptoWalletId(cryptoWalletId: string) {
    try {
      return await cryptoWalletEncryptionKeyRepository.getKeysByCryptoWalletId(
        cryptoWalletId
      )
    } catch (err) {
      throw err
    }
  }
}

export const cryptoWalletEncryptionKeyService =
  new CryptoWalletEncryptionKeyService()
