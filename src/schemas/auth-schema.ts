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

const jwtTokenSchema = z.object({
  userId: z.string(),
  telegramId: z.string(),
  userRole: z.string()
})

export type JWTTokenInput = z.infer<typeof jwtTokenSchema>

const authorizeSchema = z.object({
  telegramUsername: z.string(),
  otpCode: z.string().max(6)
})

export type AuthorizeInput = z.infer<typeof authorizeSchema>

export const { schemas: authSchemas, $ref } = buildJsonSchemas(
  {
    otpSchema,
    jwtTokenSchema,
    authorizeSchema
  },
  { $id: 'authSchemas' }
)
