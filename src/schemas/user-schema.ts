import { UserRole } from '@prisma/client'
import { z } from 'zod'

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z
    .string()
    .email({ message: 'Invalid email format' })
    .optional()
    .nullable(),
  telegramId: z.string().refine((value) => !isNaN(parseFloat(value)), {
    message: 'telegramId must be a number as a string'
  }),
  telegramUsername: z
    .string()
    .regex(/^[a-zA-Z0-9_]{4,31}$/, { message: 'Invalid telegram username' }),
  phoneNumber: z.string().optional().nullable(),
  fullname: z.string().optional().nullable(),
  role: z.nativeEnum(UserRole),
  createdAt: z.date(),
  updatedAt: z.date().nullable()
})

export const registrationSchema = userSchema.pick({
  email: true,
  telegramUsername: true
})
export const getUserByTgIdSchema = userSchema.pick({ telegramId: true })
export const getUserByIdSchema = userSchema.pick({ id: true })

export type UserInput = z.infer<typeof userSchema>
export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>
export type GetUserByTgIdInput = z.infer<typeof getUserByTgIdSchema>
