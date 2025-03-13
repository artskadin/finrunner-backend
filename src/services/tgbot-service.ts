import { kafkaServie } from './kafka/kafka-service'
import { KafkaTopics } from './kafka/kafka-topics'

class TgBotService {
  async sendOtp({ tgId, otpCode }: { tgId: string; otpCode: string }) {
    await kafkaServie.send(KafkaTopics.AuthEvents, {
      type: 'SEND_OTP_TO_USER',
      payload: {
        telegramId: tgId,
        code: otpCode
      }
    })
  }
}

export const tgBotService = new TgBotService()
