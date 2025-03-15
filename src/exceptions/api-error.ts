import { ApiErrorType } from './error-types'

export class ApiError extends Error {
  public status: number
  public type: ApiErrorType
  public details?: string

  constructor(
    status: number,
    type: ApiErrorType,
    message: string,
    details?: string
  ) {
    super(message)
    this.status = status
    this.type = type
    this.details = details
  }

  public static Unauthorized() {
    return new ApiError(401, 'UNAUTHORIZED', 'User is not authorized')
  }

  public static InvalidAccessToken() {
    return new ApiError(401, 'INVALID_ACCESS_TOKEN', 'Invalid access token')
  }

  public static InvalidRefreshToken() {
    return new ApiError(401, 'INVALID_REFRESH_TOKEN', 'Invalid refresh token')
  }

  public static Forbidden(userId: string) {
    return new ApiError(
      403,
      'FORBIDDEN',
      `Insufficient permissions for user ${userId}`
    )
  }

  public static InvalidId(id: string) {
    return new ApiError(400, 'INVALID_ID', `Invalid id ${id}`)
  }

  public static EntityAlreadyExist(entityName: string, field: string) {
    return new ApiError(
      400,
      'ALREADY_EXISTS',
      `The entity '${entityName}' with field '${field}' already exists`
    )
  }

  public static UserByUserIdNotFound(userId: string) {
    return new ApiError(
      404,
      'USER_BY_USER_ID_NOT_FOUND',
      `User with userId ${userId} not found`
    )
  }

  public static UserNotFound(id: string) {
    return new ApiError(404, 'USER_NOT_FUOND', `User with id ${id} not found`)
  }

  public static TelegramUsernameNotFound(telegramUsername: string) {
    return new ApiError(
      404,
      'TG_USERNAME_NOT_FUOND',
      `User with telegramUsername ${telegramUsername} not found`
    )
  }

  public static TelegramIdNotFound(telegramId: string) {
    return new ApiError(
      404,
      'TG_ID_NOT_FUOND',
      `User with telegramId ${telegramId} not found`
    )
  }

  public static OtpCodesNotMatch() {
    return new ApiError(
      404,
      'OTP_CODES_NOT_MATCH',
      `OTP codes don't match or the lifetime has expired`
    )
  }
}
