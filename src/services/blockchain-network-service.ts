import { Prisma } from '@prisma/client'
import { blockchainNetworkRepository } from '../repositories/blockchain-network-repository'
import { BlockchainNetworkApiError } from '../exceptions/blockchain-network-api-error'
import { Blockchain, BlockchainManager } from '../blockchain-manager'
import { BaseService } from './base-service'

/**
 * Сервис для работы с блокчейнами
 */
class BlockchainNetworkService extends BaseService {
  async getAvailableBlockchainNetworks() {
    try {
      return BlockchainManager.getAvailableBlockchains()
    } catch (err) {
      this.handleError(err)
    }
  }

  async createNetwork(network: Prisma.BlockchainNetworkCreateInput) {
    try {
      const availableBlockchains = BlockchainManager.getAvailableBlockchains()

      const networkName = network.name as Blockchain

      if (availableBlockchains.includes(networkName)) {
        return await blockchainNetworkRepository.createNetwork(network)
      }

      throw BlockchainNetworkApiError.InvalidBlockchainNetworkName(network.name)
    } catch (err) {
      this.handleError(err)
    }
  }

  async updateNetwork(
    id: string,
    network: Prisma.BlockchainNetworkUpdateInput
  ) {
    try {
      return await blockchainNetworkRepository.updateNetwork(id, network)
    } catch (err) {
      this.handleError(err)
    }
  }

  async getNetworkById(id: string) {
    try {
      return await blockchainNetworkRepository.getNetworkById(id)
    } catch (err) {
      this.handleError(err)
    }
  }

  async getAllNetworks() {
    try {
      return await blockchainNetworkRepository.getAllNetworks()
    } catch (err) {
      this.handleError(err)
    }
  }

  async removeNetwork(id: string) {
    try {
      return await blockchainNetworkRepository.removeNetwork(id)
    } catch (err) {
      this.handleError(err)
    }
  }
}

export const blockchainNetworkService = new BlockchainNetworkService()
