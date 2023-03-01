import type { JSONSchemaType } from 'ajv'
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import type { Logger } from 'pino'

import ApiGatewayProxyEventWrapper from '../event/ApiGatewayProxyEventWrapper'
import LoggerFactory from '../../logging/LoggerFactory'
import RequestBody from './RequestBody'
import type AttributeValidationErrorMapper from './AttributeValidationErrorMapper'

export default abstract class AbstractHandler<T = void> {
  protected readonly event: ApiGatewayProxyEventWrapper
  protected readonly logger: Logger
  protected readonly schema: JSONSchemaType<T> | undefined
  protected readonly attributeErrorMapper: AttributeValidationErrorMapper | undefined

  constructor(
    event: APIGatewayProxyEvent,
    loggerName: string,
    attributeErrorMapper?: AttributeValidationErrorMapper,
    schema?: JSONSchemaType<T>
  ) {
    this.event = new ApiGatewayProxyEventWrapper(event)
    this.logger = LoggerFactory.getLogger(loggerName)
    this.attributeErrorMapper = attributeErrorMapper
    this.schema = schema
  }

  protected abstract handleRequest(): Promise<APIGatewayProxyResult>

  async handle() {
    this.logger.info('API invoked: %s', this.event.getPath())

    if (this.schema && this.attributeErrorMapper) {
      this.logger.info('Starting validation of request body (Content-Length: %d)', this.event.getContentLength())

      const requestBody = this.event.getBodyAsJson()
      const invalidAttribute = RequestBody.validate(this.schema, requestBody)

      if (invalidAttribute !== null) {
        return RequestBody.handleInvalidAttribute(this.attributeErrorMapper, invalidAttribute, this.logger)
      }
    }

    return this.handleRequest()
  }
}
