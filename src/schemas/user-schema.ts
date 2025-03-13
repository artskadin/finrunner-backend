import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const userSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  telegramId: z.bigint()
})

const registrationSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }).optional(),
  telegramUsername: z
    .string()
    .regex(/^@[a-zA-Z0-9_]{4,31}$/, { message: 'Invalid telegram username' })
})

const getUserByTgIdSchema = z.object({
  telegramId: z.string()
})

const getUserByIdSchema = z.object({
  id: z.string()
})

export type UserInput = z.infer<typeof userSchema>
export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>
export type GetUserByTgIdInput = z.infer<typeof getUserByTgIdSchema>

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    userSchema,
    registrationSchema,
    getUserByIdSchema,
    getUserByTgIdSchema
  },
  { $id: 'userSchemas' }
)
