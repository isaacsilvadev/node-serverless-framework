import type { JSONSchemaType } from 'ajv'
import type { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'

import AbstractHandler from '../../../../src/nsf/aws/apiGateway/AbstractHandler'
import ApiGatewayProxyEventFactory from '../../_helper/ApiGatewayProxyEventFactory'
import ApplicationError from '../../../../src/nsf/error/ApplicationError'
import ResponseFactory from '../../../../src/nsf/aws/apiGateway/ResponseFactory'
import type AttributeValidationErrorMapper from '../../../../src/nsf/aws/apiGateway/AttributeValidationErrorMapper'

interface Test {
  field: string
}

const testSchema: JSONSchemaType<Test> = {
  type: 'object',
  properties: {
    field: {
      type: 'string'
    }
  },
  required: ['field']
}

class TestError extends ApplicationError {
  constructor() {
    super('ApplicationError', '400', 'Test Error')
  }
}

class TestErrorMapper implements AttributeValidationErrorMapper {
  getError(): ApplicationError | null {
    return new TestError()
  }
}

class TestHandler extends AbstractHandler<Test> {
  constructor(event: APIGatewayProxyEvent) {
    super(event, 'testHandler', new TestErrorMapper(), testSchema)
  }

  protected handleRequest(): Promise<APIGatewayProxyResult> {
    return Promise.resolve(ResponseFactory.ok(this.event.getBodyAsJson()))
  }
}

describe('Success', () => {
  test('should call handle correctly', async () => {
    const body = { field: 'test' }
    const event = ApiGatewayProxyEventFactory.newEvent({ body })
    const testHandler = new TestHandler(event)

    await expect(testHandler.handle()).resolves.toStrictEqual(ResponseFactory.ok(body))
  })
})

describe('Failure', () => {
  test('should return error for invalid body', async () => {
    const body = { name: 'test' }
    const event = ApiGatewayProxyEventFactory.newEvent({ body })
    const testHandler = new TestHandler(event)

    await expect(testHandler.handle()).resolves.toStrictEqual(ResponseFactory.error(new TestError()))
  })
})
