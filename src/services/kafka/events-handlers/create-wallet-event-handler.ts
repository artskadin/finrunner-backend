import { Blockchain, BlockchainManager } from '../../../blockchain-manager'
import { env } from '../../../envSettings/env'
import { blockchainNetworkService } from '../../blockchain-network-service'
import { cryptoWalletService } from '../../crypto-wallet-service'
import { KafkaEventHandler } from '../event-handlers'
import { CreateWalletEvent } from '../event-types'
import { kafkaServie } from '../kafka-service'
import { KafkaTopics } from '../kafka-topics'

/**
 * Обработчик для создания кошелька в выбранном blockchain и сохранением в БД
 */
export class CreateWalletEventHandler
  implements KafkaEventHandler<CreateWalletEvent>
{
  type = 'CREATE_WALLET_EVENT' as const

  constructor() {
    kafkaServie.consume(KafkaTopics.CryptoWalletEvents)
  }

  async handle(message: CreateWalletEvent): Promise<void> {
    try {
      const { blockchainNetworkId } = message.payload

      const network =
        await blockchainNetworkService.getNetworkById(blockchainNetworkId)

      if (!network) {
        throw new Error(
          `Failed to find blockchain network with id '${blockchainNetworkId}' while creating wallet`
        )
      }

      const blockchainManager = new BlockchainManager({
        chainType: 'testnet',
        apiKey: env.ALCHEMY_API_KEY,
        rpcUrl: env.ETH_TESTNET_PROVIDER_RPC_URL
      })

      const createdWalletInBlockchain = await blockchainManager.createWallet(
        network.name as Blockchain
      )

      const createdWalletInDB = await cryptoWalletService.createWallet({
        blockchainNetworkId,
        address: createdWalletInBlockchain.address,
        publicKey: createdWalletInBlockchain.publicKey,
        privateKey: createdWalletInBlockchain.privateKey
      })

      // Нужно отправить реквизиты по вебсокету клиенту???
    } catch (err) {
      throw err
    }
  }
}
