import { z } from 'zod'
import { userSchema } from './user-schema'
import { UserRole } from '@prisma/client'

export const otpSchema = userSchema.pick({ telegramUsername: true })
export const jwtTokenSchema = userSchema
  .pick({
    telegramId: true
  })
  .extend({
    userId: z.string().uuid(),
    userRole: z.nativeEnum(UserRole)
  })
export const authorizeSchema = userSchema
  .pick({ telegramUsername: true })
  .extend({ otpCode: z.string().max(6) })
export const authorizeResponseSchema = userSchema.pick({ id: true }).extend({
  message: z.string(),
  accessToken: z.string().jwt()
})

export type OtpInput = z.infer<typeof otpSchema>
export type JWTTokenInput = z.infer<typeof jwtTokenSchema>
export type AuthorizeInput = z.infer<typeof authorizeSchema>
export type AuthorizeResponse = z.infer<typeof authorizeResponseSchema>
