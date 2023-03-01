import type { APIGatewayProxyResult } from 'aws-lambda'

import ApplicationError from '../../../../src/nsf/error/ApplicationError'
import ApplicationErrorCode from '../../../../src/nsf/error/ApplicationErrorCode'
import HttpStatus from '../../../../src/nsf/aws/apiGateway/HttpStatus'
import ResponseErrorHandler from '../../../../src/nsf/aws/apiGateway/ResponseErrorHandler'
import ResponseFactory from '../../../../src/nsf/aws/apiGateway/ResponseFactory'

const _newErrorResponse = (errorCode: string): APIGatewayProxyResult => {
  return {
    body: '',
    headers: {
      ...ResponseFactory.HEADERS,
      [ResponseFactory.APPLICATION_ERROR_HEADER]: errorCode
    },
    statusCode: HttpStatus.BAD_REQUEST
  }
}

class VoidError extends ApplicationError {
  constructor() {
    super('VoidError', 'ERR-001', 'A void error')
    this.stack = ''
  }
}

class ErrorWithoutCode extends ApplicationError {
  constructor() {
    super('ErrorWithoutCode', '', 'A codeless error')
    this.stack = ''
  }
}

test('should handle an application error', () => {
  const response = ResponseErrorHandler.handle(new VoidError())
  expect(response).toStrictEqual(_newErrorResponse('ERR-001'))
})

test('should handle an application error without code', () => {
  const response = ResponseErrorHandler.handle(new ErrorWithoutCode())
  expect(response).toStrictEqual(_newErrorResponse(ApplicationErrorCode.UNKNOWN))
})

test('should handle any error', () => {
  const response = ResponseErrorHandler.handle(new Error())
  expect(response).toStrictEqual(_newErrorResponse(ApplicationErrorCode.UNKNOWN))
})
