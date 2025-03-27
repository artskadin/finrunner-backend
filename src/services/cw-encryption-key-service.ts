import { Prisma } from '@prisma/client'
import { cryptoWalletEncryptionKeyRepository } from '../repositories/cw-encryption-key-repository'
import { BaseService } from './base-service'

/**
 * Сервис для работы с шифрованием private data у кошельков.
 * Пока не используется
 */
class CryptoWalletEncryptionKeyService extends BaseService {
  async createKey(key: Prisma.CryptoWalletEncryptionKeyUncheckedCreateInput) {
    try {
      return await cryptoWalletEncryptionKeyRepository.createKey({
        ...key,
        CryptoWallet: { connect: { id: key.cryptoWalletId } }
      })
    } catch (err) {
      this.handleError(err)
    }
  }

  async getKeyById(id: string) {
    try {
      return await cryptoWalletEncryptionKeyRepository.getKeyById(id)
    } catch (err) {
      this.handleError(err)
    }
  }

  async getKeysByCryptoWalletId(cryptoWalletId: string) {
    try {
      return await cryptoWalletEncryptionKeyRepository.getKeysByCryptoWalletId(
        cryptoWalletId
      )
    } catch (err) {
      this.handleError(err)
    }
  }
}

export const cryptoWalletEncryptionKeyService =
  new CryptoWalletEncryptionKeyService()
