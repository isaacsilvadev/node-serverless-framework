import type ApplicationError from '../../error/ApplicationError'

export default interface AttributeValidationErrorMapper {
  getError(attributeName: string): ApplicationError | null
}
