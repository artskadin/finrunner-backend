import { FastifyReply } from 'fastify/types/reply'
import { FastifyRequest } from 'fastify/types/request'
import {
  CreateCryptoAssetInput,
  DeleteCryptoAssetParams,
  GetCryptoAssetByIdInput,
  UpdateCryptoAssetBody,
  UpdateCryptoAssetParams
} from '../schemas/crypto-asset-schema'
import { cryptoAssetService } from '../services/crypto-asset-service'

class CryptoAssetController {
  async createCryptoAsset(
    req: FastifyRequest<{ Body: CreateCryptoAssetInput }>,
    reply: FastifyReply
  ) {
    try {
      const { currencyId, blockchainNetworkId } = req.body

      const createdCryptoAsset = await cryptoAssetService.createCryptoAsset({
        currency: {
          connect: { id: currencyId }
        },
        blockchainNetwork: {
          connect: { id: blockchainNetworkId }
        }
      })

      reply.status(201).send(createdCryptoAsset)
    } catch (err) {
      throw err
    }
  }

  async getCryptoAssets(req: FastifyRequest, reply: FastifyReply) {
    try {
      const cryptoAssets = await cryptoAssetService.getCryptoAssets()

      reply.status(200).send(cryptoAssets)
    } catch (err) {
      throw err
    }
  }

  async getCryptoAssetById(
    req: FastifyRequest<{ Params: GetCryptoAssetByIdInput }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params

      const cryptoAsset = await cryptoAssetService.getCryptoAssetById(id)

      reply.status(200).send(cryptoAsset)
    } catch (err) {
      throw err
    }
  }

  async updateCryptoAsset(
    req: FastifyRequest<{
      Params: UpdateCryptoAssetParams
      Body: UpdateCryptoAssetBody
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params
      const { currencyId, blockchainNetworkId } = req.body

      // Кажется, эта функциональность под вопросом: эту сущность нельзя менять, только создавать/удалять
      // const updatedCryptoAsset = await cryptoAssetService.updateCryptoAsset(
      //   id,
      //   { currencyId, blockchainNetworkId }
      // )

      reply.status(200).send('none')
    } catch (err) {
      throw err
    }
  }

  async deleteCryptoAsset(
    req: FastifyRequest<{ Params: DeleteCryptoAssetParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params

      const deletedCryptoAsset = await cryptoAssetService.deleteCryptoAsset(id)

      reply.status(200).send(deletedCryptoAsset)
    } catch (err) {
      throw err
    }
  }
}

export const cryptoAssetController = new CryptoAssetController()
