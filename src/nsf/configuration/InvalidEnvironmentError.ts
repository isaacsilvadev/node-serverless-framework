import ApplicationError from '../error/ApplicationError'
import ApplicationErrorCode from '../error/ApplicationErrorCode'

export default class InvalidEnvironmentError extends ApplicationError {
  constructor(value: string) {
    super('InvalidEnvironmentError', ApplicationErrorCode.ILLEGAL_ARGUMENT, value)
  }
}
