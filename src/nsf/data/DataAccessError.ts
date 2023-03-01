import ApplicationError from '../error/ApplicationError'
import ApplicationErrorCode from '../error/ApplicationErrorCode'

export default class DataAccessError extends ApplicationError {
  constructor(error: any) {
    super('DataAccessError', ApplicationErrorCode.DATA_ACCESS_ERROR, DataAccessError.getMessage(error))
  }

  private static getMessage(error: any): string {
    if (error instanceof ApplicationError) {
      return `[${error.code}] ${error.message}`
    }

    if (error instanceof Error) {
      return `[${error.name}] ${error.message}`
    }

    return String(error)
  }
}
