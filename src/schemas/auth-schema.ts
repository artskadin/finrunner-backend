import { buildJsonSchemas } from 'fastify-zod'
import { z } from 'zod'

const otpSchema = z
  .object({
    telegramUsername: z
      .string()
      .regex(/^@[a-zA-Z0-9_]{4,31}$/, { message: 'Invalid telegram username' })
  })
  .describe('otpSchema')

export type OtpInput = z.infer<typeof otpSchema>

export const { schemas: authSchemas, $ref } = buildJsonSchemas(
  {
    otpSchema
  },
  { $id: 'authSchemas' }
)
