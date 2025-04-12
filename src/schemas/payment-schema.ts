import { PaymentStatus, PaymentTarget, PaymentType } from '@prisma/client'
import Decimal from 'decimal.js'
import { z } from 'zod'

export const paymentSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(PaymentType),
  target: z.nativeEnum(PaymentTarget),
  status: z.nativeEnum(PaymentStatus),
  amount: z
    .string()
    .refine((value) => !isNaN(parseFloat(value)), {
      message: 'amount must be a valid number as a string'
    })
    .refine((value) => parseFloat(value) >= 0, {
      message: 'amount must be a valid non-negative decimal'
    })
    .transform((value) => new Decimal(value)),
  bidId: z.string().uuid(),
  currencyId: z.string().uuid(),
  cryptoWalletId: z.string().uuid().nullable(),
  deadline: z.date(),
  transactionHash: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable()
})

export const createPaymentSchema = paymentSchema.pick({
  type: true,
  target: true,
  amount: true,
  deadline: true,
  bidId: true,
  currencyId: true
})

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>
