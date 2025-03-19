import { PrismaClient } from '@prisma/client'
import { ApiError } from '../exceptions/api-error'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

type ErrorMeta = {
  modelName: string
  target: string[]
}

export class BaseRepository {
  protected readonly prisma = new PrismaClient()

  protected handlePrismaError(err: unknown, context: string = '') {
    console.error(err)

    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002': {
          const { modelName, target } = err.meta as ErrorMeta

          throw ApiError.EntityAlreadyExist(modelName, target[0])
        }
        case 'P2003': {
          const { modelName, field_name } = err.meta as {
            modelName: string
            field_name: string
          }

          throw ApiError.ForeignKeyConstraintViolated(modelName)
        }
        case 'P2023':
          throw ApiError.InvalidId(context)
        case 'P2025': {
          const { modelName, cause } = err.meta as {
            modelName: string
            cause: string
          }
          throw ApiError.OneOrMoreRecordsWereRequiredButNotFound(cause)
        }
      }
    }

    throw err
  }
}
