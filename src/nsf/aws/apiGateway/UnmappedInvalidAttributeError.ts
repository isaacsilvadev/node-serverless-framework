import ApplicationError from '../../error/ApplicationError'
import ApplicationErrorCode from '../../error/ApplicationErrorCode'

export default class UnmappedInvalidAttributeError extends ApplicationError {
  constructor(attribute: string) {
    super('UnmappedInvalidAttributeError', ApplicationErrorCode.UNMAPPED_INVALID_ATTRIBUTE, attribute)
  }
}
