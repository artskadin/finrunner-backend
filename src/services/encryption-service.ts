import crypto from 'crypto'
import { Envs } from '../envSettings'

class EncryptionService {
  private static instance: EncryptionService | null = null
  private encryptionKey: Buffer

  constructor(envs: Envs) {
    this.encryptionKey = Buffer.from(envs.ENCRYPTION_KEY, 'hex')
  }

  public static getInstance(envs?: Envs) {
    if (!EncryptionService.instance) {
      if (!envs) {
        throw new Error(
          'Envs must be provided to initialize the EncryptionService'
        )
      }

      EncryptionService.instance = new EncryptionService(envs)
    }

    return EncryptionService.instance
  }

  encrypt(text: string) {
    try {
      const iv = crypto.randomBytes(16)
      const chipher = crypto.createCipheriv(
        'aes-256-cbc',
        this.encryptionKey,
        iv
      )
      let encrypted = chipher.update(text, 'utf8', 'hex')
      encrypted += chipher.final('hex')

      return { encryptedText: encrypted, iv: iv.toString('hex') }
    } catch (err) {
      throw new Error(`Failed to encrypt text ${text}. Error: ${err}`)
    }
  }

  decrypt(encryptedText: string, iv: string) {
    try {
      const dechipher = crypto.createDecipheriv(
        'aes-256-cbc',
        this.encryptionKey,
        Buffer.from(iv, 'hex')
      )

      let decrypted = dechipher.update(encryptedText, 'hex', 'utf8')
      decrypted += dechipher.final('utf8')

      return decrypted
    } catch (err) {
      throw new Error(
        `Failed to decrypt encryptedText ${encryptedText}. Error: ${err}`
      )
    }
  }
}

export const getEncryptionService = (envs?: Envs) =>
  EncryptionService.getInstance(envs)
