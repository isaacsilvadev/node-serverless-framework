import Ajv, { ErrorObject, JSONSchemaType, ValidateFunction } from 'ajv'
import type { APIGatewayProxyResult } from 'aws-lambda'
import type { Logger } from 'pino'

import type AttributeValidationErrorMapper from './AttributeValidationErrorMapper'
import ResponseFactory from './ResponseFactory'
import UnmappedInvalidAttributeError from './UnmappedInvalidAttributeError'
import type ApplicationError from '../../error/ApplicationError'

export default class RequestBody {
  private static readonly ajv = new Ajv()

  static handleInvalidAttribute(
    mapper: AttributeValidationErrorMapper,
    attributeName: string,
    logger: Logger
  ): APIGatewayProxyResult {
    const error: ApplicationError = mapper.getError(attributeName) || new UnmappedInvalidAttributeError(attributeName)

    if (!(error instanceof UnmappedInvalidAttributeError)) {
      logger.warn('[%s] %s; cancelling request', error.code, error.message)
    } else {
      logger.error('[%s] Unknown invalid attribute: %s', error.code, attributeName)
    }

    return ResponseFactory.error(error)
  }

  static validate<T>(schema: JSONSchemaType<T>, subject: any | null = undefined) {
    const validate: ValidateFunction = RequestBody.ajv.compile(schema)
    const valid: boolean = validate(subject !== undefined && subject !== null ? subject : {})

    if (!valid) {
      return RequestBody.extractInvalidAttribute(validate.errors)
    }

    return null
  }

  private static extractInvalidAttribute(
    errors: ErrorObject<string, Record<string, unknown>>[] | null | undefined
  ): string | null {
    if (errors === undefined || errors === null || errors[0] === undefined) {
      return null
    }

    // Does not need to check if errors has elements, Ajv only considers invalid when it has them.
    switch (errors[0].keyword) {
      case 'required':
        return String(errors[0].params['missingProperty'])

      case 'minLength':
      case 'type':
      default:
        return String(errors[0]['instancePath'].split('/').pop())
    }
  }
}
