import HttpStatus from '../../../../src/nsf/aws/apiGateway/HttpStatus'
import ResponseFactory from '../../../../src/nsf/aws/apiGateway/ResponseFactory'
import ApplicationError from '../../../../src/nsf/error/ApplicationError'
import ApplicationErrorCode from '../../../../src/nsf/error/ApplicationErrorCode'

class TestError extends ApplicationError {
  constructor(errorCode: string) {
    super('TestError', errorCode, 'message')
  }
}

type ErrorTestTable = {
  testName: string
  input: {
    error: Error
    statusCode?: number
  }
  output: {
    xApplicationErrorHeader: string
    statusCode: number
  }
}

type SuccessTestTable = {
  testName: string
  input: string | number | object
  output: string
}

describe('Response: error', () => {
  const testTable: ErrorTestTable[] = [
    {
      testName: 'default',
      input: {
        error: new TestError('ERR-999')
      },
      output: {
        xApplicationErrorHeader: 'ERR-999',
        statusCode: HttpStatus.BAD_REQUEST
      }
    },
    {
      testName: 'custom',
      input: {
        error: new TestError('ERR-000'),
        statusCode: HttpStatus.I_AM_A_TEAPOT
      },
      output: {
        xApplicationErrorHeader: 'ERR-000',
        statusCode: HttpStatus.I_AM_A_TEAPOT
      }
    }
  ]

  test.each(testTable)(
    'should return an error response with $testName status code',
    ({
      /* eslint @typescript-eslint/ban-ts-comment: off, @typescript-eslint/no-unused-vars: off */
      // @ts-ignore
      testName,
      input: testInput,
      output: testOutput
    }) => {
      expect(ResponseFactory.error(testInput.error, testInput.statusCode)).toStrictEqual({
        body: '',
        headers: {
          ...ResponseFactory.HEADERS,
          [ResponseFactory.APPLICATION_ERROR_HEADER]: testOutput.xApplicationErrorHeader
        },
        statusCode: testOutput.statusCode
      })
    }
  )

  test('should return an unknown error response', () => {
    expect(ResponseFactory.error(new Error())).toStrictEqual({
      body: '',
      headers: {
        ...ResponseFactory.HEADERS,
        [ResponseFactory.APPLICATION_ERROR_HEADER]: ApplicationErrorCode.UNKNOWN
      },
      statusCode: HttpStatus.BAD_REQUEST
    })
  })
})

describe('Response: success', () => {
  const testTable: SuccessTestTable[] = [
    {
      testName: 'with object body',
      input: { anAttribute: 'aStringValue' },
      output: '{"anAttribute":"aStringValue"}'
    },
    {
      testName: 'with string body',
      input: 'aStringValue',
      output: '"aStringValue"'
    },
    {
      testName: 'with number body',
      input: 99,
      output: '99'
    }
  ]

  test('should return a success without content', () => {
    expect(ResponseFactory.noContent()).toStrictEqual({
      body: '',
      headers: ResponseFactory.HEADERS,
      statusCode: HttpStatus.NO_CONTENT
    })
  })

  test('should return success for accepted', () => {
    expect(ResponseFactory.accepted()).toStrictEqual({
      body: '',
      headers: ResponseFactory.HEADERS,
      statusCode: HttpStatus.ACCEPTED
    })
  })

  test.each(testTable)(
    'should return a success response $testName',
    ({
      /* eslint @typescript-eslint/ban-ts-comment: off, @typescript-eslint/no-unused-vars: off */
      // @ts-ignore
      testName,
      input: testInput,
      output: testOutput
    }) => {
      expect(ResponseFactory.ok(testInput)).toStrictEqual({
        body: testOutput,
        headers: ResponseFactory.HEADERS,
        statusCode: HttpStatus.OK
      })
    }
  )
})
