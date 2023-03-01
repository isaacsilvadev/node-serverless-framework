import ApplicationError from '../error/ApplicationError'
import ApplicationErrorCode from '../error/ApplicationErrorCode'

export default class ApplicationPropertyMissingError extends ApplicationError {
  constructor(propertyName: string) {
    super('ApplicationPropertyMissingError', ApplicationErrorCode.APPLICATION_PROPERTY_MISSING, propertyName)
  }
}
