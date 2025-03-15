import { PrismaClient, Prisma } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { BlockchainNetworkApiError } from '../exceptions/blockchain-network-api-error'
import { ApiError } from '../exceptions/api-error'

class BlockchainNetworkRepository {
  prisma = new PrismaClient()

  private handlePrismaError(err: unknown, context: string = '') {
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          throw BlockchainNetworkApiError.NetworkAlreadyExists('tokenStandart')
        case 'P2023':
          throw ApiError.InvalidId(context)
      }
    }
  }

  async createNetwork(network: Prisma.BlockchainNetworkCreateInput) {
    try {
      return await this.prisma.blockchainNetwork.create({ data: network })
    } catch (err) {
      this.handlePrismaError(err)

      throw new Error(`Failed to create network ${network.name}. Error: ${err}`)
    }
  }

  async updateNetwork(
    id: string,
    network: Prisma.BlockchainNetworkUpdateInput
  ) {
    try {
      return await this.prisma.blockchainNetwork.update({
        where: { id },
        data: network
      })
    } catch (err) {
      this.handlePrismaError(err, id)

      throw new Error(`Failed to update network ${network.name}. Error: ${err}`)
    }
  }

  async getNetworkById(id: string) {
    try {
      return await this.prisma.blockchainNetwork.findUnique({ where: { id } })
    } catch (err) {
      this.handlePrismaError(err, id)

      throw new Error(`Failed to get network with id ${id}. Error: ${err}`)
    }
  }

  async getAllNetworks() {
    try {
      return await this.prisma.blockchainNetwork.findMany()
    } catch (err) {
      throw new Error(`Failed to get all blockchain networks`)
    }
  }

  async removeNetwork(id: string) {
    try {
      return await this.prisma.blockchainNetwork.delete({ where: { id } })
    } catch (err) {
      this.handlePrismaError(err, id)

      throw new Error(`Failed to delete network with id ${id}. Error: ${err}`)
    }
  }
}

export const blockchainNetworkRepository = new BlockchainNetworkRepository()
