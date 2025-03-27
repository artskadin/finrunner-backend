import { Kafka, Producer, Consumer } from 'kafkajs'
import { KafkaEvent } from './event-types'
import { kafkaEventHandlerRegistry } from './event-handler-registry'
import { KafkaTopics } from './kafka-topics'
import { BaseService } from '../base-service'

class KafkaService extends BaseService {
  private static instance: KafkaService | null = null
  private kafka: Kafka
  private producer: Producer
  private consumer: Consumer
  private isConnected: boolean = false
  private subscribedTopics: Set<KafkaTopics> = new Set()

  private constructor(brokers: string[], clientId: string, groupId: string) {
    super()

    this.kafka = new Kafka({
      clientId,
      brokers
    })

    this.producer = this.kafka.producer()
    this.consumer = this.kafka.consumer({ groupId })
  }

  public static getInstance(
    brokers: string[],
    clientId: string,
    groupId: string
  ): KafkaService {
    if (!KafkaService.instance) {
      KafkaService.instance = new KafkaService(brokers, clientId, groupId)
    }

    return KafkaService.instance
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Kafka is already connected')
      return
    }

    try {
      await this.producer.connect()
      await this.consumer.connect()
      this.isConnected = true
      console.log('Kafka connected successfully')
    } catch (err) {
      console.error('Failed to connect to Kafka', err)
      throw err
    }
  }

  async send<T extends KafkaEvent>(
    topic: KafkaTopics,
    message: T
  ): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Kafka is not connected. Call connect() first')
    }

    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }]
      })
    } catch (err) {
      throw err
    }
  }

  async consume(topic: KafkaTopics): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Kafka is not connected. Call connect() first')
    }

    if (this.subscribedTopics.has(topic)) {
      console.warn(
        `Already subscribed to topic: ${topic}. Ignoring duplicate subscription`
      )
      return
    }

    try {
      await this.consumer.subscribe({ topic, fromBeginning: true })

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const data = JSON.parse(message.value!.toString()) as KafkaEvent

            const handler = kafkaEventHandlerRegistry.getHandler(data.type)

            if (handler) {
              await handler.handle(data)
            }
          } catch (err) {
            this.handleError(err)
          }
        }
      })

      this.subscribedTopics.add(topic)
    } catch (err) {
      this.handleError(`Failed to subscribe to topic: ${topic}. Error: ${err}`)
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Kafka is already disconnected')
    }

    try {
      await this.producer.disconnect()
      await this.consumer.disconnect()
      this.isConnected = false

      console.log('Kafka disconnected successfully')
    } catch (err) {
      this.handleError(`Failed to disconnect from Kafka. Error: ${err}`)
    }
  }
}

const brokers = ['localhost:29092']
const clientId = 'backend-service'
const groupId = 'backend-group'

export const kafkaServie = KafkaService.getInstance(brokers, clientId, groupId)
