import { Prisma } from '@prisma/client'
import { BaseService } from './base-service'
import { cryptoAssetRepository } from '../repositories/crypto-asset-repository'

/**
 * Сервис для работы с крипто активами.
 * Криптоактив - это соединение криптовалюты и блокчейн сети.
 * К примеру: Ethereum ETH (это валюта) с сетью Ethereum ERC-20 или
 * Tether USDT (это валюта) с сетью Ethereum ERC-20
 */
class CryptoAssetService extends BaseService {
  async createCryptoAsset(cryptoAsset: Prisma.CryptoAssetCreateInput) {
    try {
      return await cryptoAssetRepository.createCryptoAsset(cryptoAsset)
    } catch (err) {
      this.handleError(err)
    }
  }

  async getCryptoAssets() {
    try {
      return await cryptoAssetRepository.getCryptoAssets()
    } catch (err) {
      this.handleError(err)
    }
  }

  async getCryptoAssetById(id: string) {
    try {
      return await cryptoAssetRepository.getCryptoAssetById(id)
    } catch (err) {
      this.handleError(err)
    }
  }

  async updateCryptoAsset(
    id: string,
    cryptoAsset: Prisma.CryptoAssetUncheckedUpdateInput
  ) {
    try {
      return await cryptoAssetRepository.updateCryptoAsset(id, cryptoAsset)
    } catch (err) {
      this.handleError(err)
    }
  }

  async deleteCryptoAsset(id: string) {
    try {
      return await cryptoAssetRepository.deleteCryptoAsset(id)
    } catch (err) {
      this.handleError(err)
    }
  }
}

export const cryptoAssetService = new CryptoAssetService()
