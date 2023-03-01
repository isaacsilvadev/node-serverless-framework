import type { APIGatewayProxyResult } from 'aws-lambda'

import ApplicationError from '../../error/ApplicationError'
import ApplicationErrorCode from '../../error/ApplicationErrorCode'
import ApplicationProperties from '../../configuration/ApplicationProperties'
import HttpStatus from './HttpStatus'

export default class ResponseFactory {
  static readonly APPLICATION_ERROR_HEADER: string = 'X-Application-Error'

  static readonly HEADERS: { [header: string]: boolean | number | string } = {
    'Access-Control-Allow-Origin': ApplicationProperties.get('CORS_ALLOW_ORIGIN'),
    'Access-Control-Expose-Headers': ResponseFactory.APPLICATION_ERROR_HEADER,
    'Content-Type': 'application/json'
  }

  static accepted() {
    return {
      body: '',
      headers: ResponseFactory.HEADERS,
      statusCode: HttpStatus.ACCEPTED
    }
  }

  static error(error: Error, statusCode: number = HttpStatus.BAD_REQUEST): APIGatewayProxyResult {
    return {
      body: '',
      headers: {
        ...ResponseFactory.HEADERS,
        [ResponseFactory.APPLICATION_ERROR_HEADER]:
          !(error instanceof ApplicationError) || !error.code ? ApplicationErrorCode.UNKNOWN : error.code
      },
      statusCode
    }
  }

  static noContent(): APIGatewayProxyResult {
    return {
      body: '',
      headers: ResponseFactory.HEADERS,
      statusCode: HttpStatus.NO_CONTENT
    }
  }

  static ok(responseBody: any): APIGatewayProxyResult {
    return {
      body: JSON.stringify(responseBody),
      headers: ResponseFactory.HEADERS,
      statusCode: HttpStatus.OK
    }
  }
}
