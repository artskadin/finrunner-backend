import { FastifyReply, FastifyRequest } from 'fastify'
import {
  CreateBlockchainNetworkInput,
  DeleteBlockchainNetworkInput,
  GetBlockchainNetworkByIdInput,
  UpdateBlockchainNetworkBodyInput,
  UpdateBlockchainNetworkParamsInput
} from '../schemas/blockchain-network-schema'
import { blockchainNetworkService } from '../services/blockchain-network-service'

class BlockchainNetworkController {
  async createNetwork(
    req: FastifyRequest<{ Body: CreateBlockchainNetworkInput }>,
    reply: FastifyReply
  ) {
    try {
      const { name, tokenStandart } = req.body

      const createdNetwork = await blockchainNetworkService.createNetwork({
        name,
        tokenStandart
      })

      reply.status(201).send(createdNetwork)
    } catch (err) {
      throw err
    }
  }

  async getNetworks(req: FastifyRequest, reply: FastifyReply) {
    try {
      const networks = await blockchainNetworkService.getAllNetworks()

      reply.status(200).send(networks)
    } catch (err) {
      throw err
    }
  }

  async getNetworkById(
    req: FastifyRequest<{ Params: GetBlockchainNetworkByIdInput }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params

      const network = await blockchainNetworkService.getNetworkById(id)

      reply.status(200).send(network)
    } catch (err) {
      throw err
    }
  }

  async updateNetwork(
    req: FastifyRequest<{
      Params: UpdateBlockchainNetworkParamsInput
      Body: UpdateBlockchainNetworkBodyInput
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params
      const { name, tokenStandart } = req.body

      const updatedNetwork = await blockchainNetworkService.updateNetwork(id, {
        name,
        tokenStandart
      })

      reply.status(200).send(updatedNetwork)
    } catch (err) {
      throw err
    }
  }

  async removeNetwork(
    req: FastifyRequest<{ Params: DeleteBlockchainNetworkInput }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params

      const removedNetwork = await blockchainNetworkService.removeNetwork(id)

      reply.status(200).send(removedNetwork)
    } catch (err) {
      throw err
    }
  }
}

export const blockchainNetworkController = new BlockchainNetworkController()
