import { ApiError } from '../exceptions/api-error'

export class BaseService {
  protected handleError(err: unknown) {
    if (err instanceof ApiError) {
      throw err
    }
    console.error(err)
  }
}
