import { Prisma } from '@prisma/client'
import { cryptoWalletRepository } from '../repositories/crypto-wallet-repository'
import { getEncryptionService } from './encryption-service'

class CryptoWalletService {
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
      throw err
    }
  }

  async getWalletById(id: string) {
    try {
    } catch (err) {
      throw err
    }
  }

  async getWallets() {
    try {
    } catch (err) {
      throw err
    }
  }
}

export const cryptoWalletService = new CryptoWalletService()
