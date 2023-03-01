import type { APIGatewayProxyEvent } from 'aws-lambda'

import type { JsonObject } from './JsonObject'
import LoggerFactory from '../../logging/LoggerFactory'

const logger = LoggerFactory.getLogger('apiGatewayProxyRequestEvent')

export default class ApiGatewayProxyEventWrapper {
  private readonly event: APIGatewayProxyEvent

  constructor(event: APIGatewayProxyEvent) {
    this.event = event
  }

  getBodyAsJson(): JsonObject | null {
    if (this.event.body === null || this.event.body.trim().length === 0) {
      return null
    }

    logger.debug('Parsing JSON; content is omitted due to sensitive data')
    const json: JsonObject = JSON.parse(this.event.body) as JsonObject

    logger.trace('JSON (redacted): %o', json)
    return json
  }

  getHeader(headerName: string): string | null {
    return this.event.headers[headerName] || null
  }

  getContentLength(): number {
    return parseInt(this.getHeader('Content-Length') || '0')
  }

  getAuthorization(): string | null {
    return this.getHeader('Authorization')
  }

  getPath(): string {
    return this.event.path
  }

  getPathParameter(parameterName: string): string | null {
    if (this.event.pathParameters === null) {
      return null
    }

    return this.event.pathParameters[parameterName] || null
  }
}
