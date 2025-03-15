import { PrismaClient } from '@prisma/client'
import { ApiError } from '../exceptions/api-error'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

type ErrorMeta = {
  modelName: string
  target: string[]
}

export class BaseRepository {
  protected prisma = new PrismaClient()

  protected handlePrismaError(err: unknown, context: string = '') {
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002': {
          const { modelName, target } = err.meta as ErrorMeta

          throw ApiError.EntityAlreadyExist(modelName, target[0])
        }
        case 'P2023':
          throw ApiError.InvalidId(context)
      }
    }
  }
}
