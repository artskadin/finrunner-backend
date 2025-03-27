import { CryptoWallet, Prisma } from '@prisma/client'
import { cryptoWalletRepository } from '../repositories/crypto-wallet-repository'
import { getEncryptionService } from './encryption-service'
import { BaseService } from './base-service'
import { cryptoWalletEncryptionKeyService } from './cw-encryption-key-service'

/**
 * Сервис для работы с крипто кошельками
 */
class CryptoWalletService extends BaseService {
  async createWallet(wallet: Prisma.CryptoWalletUncheckedCreateInput) {
    try {
      const {
        blockchainNetworkId,
        address,
        publicKey,
        privateKey,
        seedPhrase
      } = wallet
      const encryptionService = getEncryptionService()

      const encryptedPrivateKey = encryptionService.encrypt(privateKey)

      const encryptionKeys: Prisma.CryptoWalletEncryptionKeyCreateWithoutCryptoWalletInput[] =
        [{ iv: encryptedPrivateKey.iv, fieldName: 'privateKey' }]

      let encryptedSeedPhrase
      if (seedPhrase) {
        encryptedSeedPhrase = encryptionService.encrypt(seedPhrase)
        encryptionKeys.push({
          iv: encryptedSeedPhrase.iv,
          fieldName: 'seedPhrase'
        })
      }

      return await cryptoWalletRepository.createWallet({
        wallet: {
          blockchainNetwork: { connect: { id: blockchainNetworkId } },
          address,
          publicKey,
          privateKey: encryptedPrivateKey.encryptedText,
          seedPhrase: encryptedSeedPhrase?.encryptedText
        },
        encryptionKeys
      })
    } catch (err) {
      this.handleError(err)
    }
  }

  async getWalletById({
    id,
    needDescrypt
  }: {
    id: string
    needDescrypt?: boolean
  }) {
    try {
      const wallet = await cryptoWalletRepository.getWalletById(id)

      if (wallet && needDescrypt) {
        return this.decryptWallet(wallet)
      }

      return wallet
    } catch (err) {
      this.handleError(err)
    }
  }

  async getWallets() {
    try {
    } catch (err) {
      throw err
    }
  }

  private async decryptWallet(wallet: CryptoWallet) {
    try {
      const encryptionService = getEncryptionService()

      const keys =
        await cryptoWalletEncryptionKeyService.getKeysByCryptoWalletId(
          wallet.id
        )

      if (!keys) {
        throw new Error(`Failed to find keys for wallet with id '${wallet.id}'`)
      }

      let descyptedFields: Record<string, string> = {}

      for (let key of keys) {
        const field = wallet[key.fieldName as keyof CryptoWallet]?.toString()

        if (!field) {
          throw new Error(
            `Failed to define field '${key.fieldName}' while decrypting wallet field`
          )
        }

        const decryptedValue = encryptionService.decrypt(field, key.iv)
        descyptedFields[key.fieldName] = decryptedValue
      }

      const decryptedWallet = { ...wallet, ...descyptedFields }

      return decryptedWallet
    } catch (err) {
      this.handleError(err)
    }
  }
}

export const cryptoWalletService = new CryptoWalletService()
