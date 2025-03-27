export type UpdateUserFromTgBotEvent = {
  type: 'UPDATE_USER_FROM_TG_BOT_EVENT'
  payload: {
    telegramId: string
    tgUsername: string
  }
}

export type UserCreatedFromTgBotEvent = {
  type: 'USER_CREATED_FROM_TG_BOT_EVENT'
  payload: {
    telegramId: string
    message: string
  }
}

export type UserUpdatedFromTgBotEvent = {
  type: 'USER_UPDATED_FROM_TG_BOT_EVENT'
  payload: {
    telegramId: string
    message: string
  }
}

export type SendOtpToUserEvent = {
  type: 'SEND_OTP_TO_USER'
  payload: {
    telegramId: string
    code: string
  }
}

export type CreateWalletEvent = {
  type: 'CREATE_WALLET_EVENT'
  payload: {
    blockchainNetworkId: string
  }
}

export type KafkaEvent =
  | UpdateUserFromTgBotEvent
  | UserCreatedFromTgBotEvent
  | UserUpdatedFromTgBotEvent
  | SendOtpToUserEvent
  | CreateWalletEvent
