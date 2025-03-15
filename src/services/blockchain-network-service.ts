import { Prisma } from '@prisma/client'
import { blockchainNetworkRepository } from '../repositories/blockchain-network-repository'

class BlockchainNetworkService {
  async createNetwork(network: Prisma.BlockchainNetworkCreateInput) {
    try {
      return await blockchainNetworkRepository.createNetwork(network)
    } catch (err) {
      throw err
    }
  }

  async updateNetwork(
    id: string,
    network: Prisma.BlockchainNetworkUpdateInput
  ) {
    try {
      return await blockchainNetworkRepository.updateNetwork(id, network)
    } catch (err) {
      throw err
    }
  }

  async getNetworkById(id: string) {
    try {
      return await blockchainNetworkRepository.getNetworkById(id)
    } catch (err) {
      throw err
    }
  }

  async getAllNetworks() {
    try {
      return await blockchainNetworkRepository.getAllNetworks()
    } catch (err) {
      throw err
    }
  }

  async removeNetwork(id: string) {
    try {
      return await blockchainNetworkRepository.removeNetwork(id)
    } catch (err) {
      throw err
    }
  }
}

export const blockchainNetworkService = new BlockchainNetworkService()
