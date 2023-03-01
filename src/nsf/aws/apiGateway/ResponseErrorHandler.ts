import type { APIGatewayProxyResult } from 'aws-lambda'
import type { Logger } from 'pino'

import ResponseFactory from './ResponseFactory'
import ApplicationError from '../../error/ApplicationError'
import ApplicationErrorCode from '../../error/ApplicationErrorCode'
import LoggerFactory from '../../logging/LoggerFactory'

const defaultLogger = LoggerFactory.getLogger('globalErrorHandler')

export default class ResponseErrorHandler {
  static handle(error: Error, logger: Logger = defaultLogger): APIGatewayProxyResult {
    if (error instanceof ApplicationError) {
      logger.warn('[%s] %s', error.code || ApplicationErrorCode.UNKNOWN, error.message)
    } else {
      logger.error(
        '[%s] Unknown or unmapped error: (%s) %s - %s',
        ApplicationErrorCode.UNKNOWN,
        error.name,
        error.message,
        ResponseErrorHandler.extractStackSample(error)
      )
    }

    return ResponseFactory.error(error)
  }

  private static extractStackSample(error: Error): string {
    /* istanbul ignore next */
    /* (note: unlikely) */
    if (error.stack === undefined || error.stack === null || error.stack.trim().length === 0) {
      return '<stack empty>'
    }

    const stackLines: string[] = error.stack.split('\n')
    return String(stackLines[1] || stackLines[0]).trim()
  }
}
