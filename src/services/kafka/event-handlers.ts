import { userService } from '../user-service'
import { KafkaEvent, UpdateUserFromTgBotEvent } from './event-types'
import { kafkaServie } from './kafka-service'
import { KafkaTopics } from './kafka-topics'

export interface KafkaEventHandler<T extends KafkaEvent> {
  type: T['type']
  handle(message: T): Promise<void>
}

export class UpdateUserFromTgBotEventHandler
  implements KafkaEventHandler<UpdateUserFromTgBotEvent>
{
  type = 'UPDATE_USER_FROM_TG_BOT_EVENT' as const

  async handle(message: UpdateUserFromTgBotEvent): Promise<void> {
    try {
      const { tgUsername, telegramId } = message.payload

      const user = await userService.getUserByTgId(telegramId)

      if (!user) {
        await userService.createUser({
          telegramId,
          telegramUsername: tgUsername
        })

        await kafkaServie.send(KafkaTopics.UserEvents, {
          type: 'USER_CREATED_FROM_TG_BOT_EVENT',
          payload: {
            telegramId: telegramId.toString(),
            message: 'User was created successfully'
          }
        })

        return
      }

      if (user.telegramUsername !== tgUsername) {
        await userService.updateUser(user.id, {
          telegramUsername: tgUsername
        })

        await kafkaServie.send(KafkaTopics.UserEvents, {
          type: 'USER_UPDATED_FROM_TG_BOT_EVENT',
          payload: {
            telegramId: telegramId.toString(),
            message: 'User was updated successfully'
          }
        })
      }
    } catch (err) {
      throw err
    }
  }
}
