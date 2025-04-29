import { z } from 'zod'

const commonApiErrorTypeSchema = z.union([
  z.literal('BAD_REQUEST'),
  z.literal('UNAUTHORIZED'),
  z.literal('INVALID_ACCESS_TOKEN'),
  z.literal('INVALID_REFRESH_TOKEN'),
  z.literal('FORBIDDEN'),
  z.literal('ALREADY_EXISTS'),
  z.literal('INVALID_ID'),
  z.literal('FOREIGN_KEY_CONSTRAINT_VIOLATED'),
  z.literal('NOT_FOUND_NESTED_RECORDS'),
  z.literal('USER_NOT_FUOND'),
  z.literal('USER_BY_USER_ID_NOT_FOUND'),
  z.literal('TG_USERNAME_NOT_FUOND'),
  z.literal('TG_ID_NOT_FUOND'),
  z.literal('OTP_CODES_NOT_MATCH')
])

const blockchainNetworkApiErrorTypeSchema = z.union([
  z.literal('NETWORK_NOT_FOUND'),
  z.literal('INVALID_BLOCKCHAIN_NETWORK_NAME')
])

const exchangePairApiErrorTypeSchema = z.union([
  z.literal('SHOULD_ONLY_BE_FROM_FIAT_OR_FROM_CRYPTO'),
  z.literal('SHOULD_ONLY_BE_TO_FIAT_OR_TO_CRYPTO')
])

export const apiErrorTypeSchema = z
  .union([
    commonApiErrorTypeSchema,
    blockchainNetworkApiErrorTypeSchema,
    exchangePairApiErrorTypeSchema
  ])
  .describe('Error type code')

export type BlockchainNetworkApiErrorType = z.infer<
  typeof blockchainNetworkApiErrorTypeSchema
>
export type ExchangePairApiErrorType = z.infer<
  typeof exchangePairApiErrorTypeSchema
>
export type CommonApiErrorType = z.infer<typeof commonApiErrorTypeSchema>
export type ApiErrorType = z.infer<typeof apiErrorTypeSchema>

export const apiErrorResponseSchema = z.object({
  type: apiErrorTypeSchema,
  message: z.string(),
  details: z.string().optional()
})

export const validationErrorResponseSchema = z.object({
  type: z.literal('BAD_REQUEST'),
  message: z.string()
})

export const internalServerErrorResponseSchema = z.object({
  type: z.literal('INTERNAL_SERVER_ERROR'),
  message: z.string()
})
