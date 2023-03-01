import type { JSONSchemaType } from 'ajv'

import type AttributeValidationErrorMapper from '../../../../src/nsf/aws/apiGateway/AttributeValidationErrorMapper'
import HttpStatus from '../../../../src/nsf/aws/apiGateway/HttpStatus'
import RequestBody from '../../../../src/nsf/aws/apiGateway/RequestBody'
import ResponseFactory from '../../../../src/nsf/aws/apiGateway/ResponseFactory'
import ApplicationPropertyMissingError from '../../../../src/nsf/configuration/ApplicationPropertyMissingError'
import type ApplicationError from '../../../../src/nsf/error/ApplicationError'
import ApplicationErrorCode from '../../../../src/nsf/error/ApplicationErrorCode'
import LoggerFactory from '../../../../src/nsf/logging/LoggerFactory'

type InvalidBodyTestTable = {
  testName: string
  input: string
  output: {
    errorCode: string
    message: string
  }
}

class TestAttributeValidationErrorMapper implements AttributeValidationErrorMapper {
  getError(attributeName: string): ApplicationError | null {
    return attributeName === 'applicationProperty' ? new ApplicationPropertyMissingError('missingProperty') : null
  }
}

const attributeValidationErrorMapper = new TestAttributeValidationErrorMapper()
const testLogger = LoggerFactory.getLogger('requestBodyUnitTest')

describe('Handle invalid body', () => {
  const testTable: InvalidBodyTestTable[] = [
    {
      testName: 'known',
      input: 'applicationProperty',
      output: {
        errorCode: ApplicationErrorCode.APPLICATION_PROPERTY_MISSING,
        message: `[${ApplicationErrorCode.APPLICATION_PROPERTY_MISSING}] applicationProperty; cancelling request`
      }
    },
    {
      testName: 'unknown',
      input: 'unknownProperty',
      output: {
        errorCode: ApplicationErrorCode.UNMAPPED_INVALID_ATTRIBUTE,
        message: `[${ApplicationErrorCode.UNMAPPED_INVALID_ATTRIBUTE}] Unknown invalid attribute: unknownProperty`
      }
    }
  ]

  test.each(testTable)(
    'should return an error response for a(n) $testName invalid attribute',
    ({
      /* eslint @typescript-eslint/ban-ts-comment: off, @typescript-eslint/no-unused-vars: off */
      // @ts-ignore
      testName,
      input: testInput,
      output: testOutput
    }) => {
      expect(RequestBody.handleInvalidAttribute(attributeValidationErrorMapper, testInput, testLogger)).toStrictEqual({
        body: '',
        headers: { ...ResponseFactory.HEADERS, [ResponseFactory.APPLICATION_ERROR_HEADER]: testOutput.errorCode },
        statusCode: HttpStatus.BAD_REQUEST
      })
    }
  )
})

type Book = {
  pages: number
  title: string
}

describe('Validate request body', () => {
  const bookSchema: JSONSchemaType<Book> = {
    type: 'object',
    properties: {
      pages: {
        type: 'number',
        maximum: 250,
        minimum: 100
      },
      title: {
        type: 'string',
        minLength: 1
      }
    },
    required: ['pages', 'title']
  }

  test('should return that the first property is missing when subject is absent', () => {
    expect(RequestBody.validate(bookSchema)).toBe('pages')
    expect(RequestBody.validate(bookSchema, null)).toBe('pages')
    expect(RequestBody.validate(bookSchema, undefined)).toBe('pages')
  })

  test('should return the missing property', () => {
    expect(RequestBody.validate(bookSchema, {})).toBe('pages')
    expect(RequestBody.validate(bookSchema, { pages: '5' })).toBe('title')
    expect(RequestBody.validate(bookSchema, { title: 5 })).toBe('pages')
  })

  test('should return the property with incorrect type', () => {
    expect(RequestBody.validate(bookSchema, { pages: 'A', title: 5 })).toBe('pages')
    expect(RequestBody.validate(bookSchema, { pages: 'A', title: '5' })).toBe('pages')
    expect(RequestBody.validate(bookSchema, { pages: 100, title: 5 })).toBe('title')
  })

  test('should return the invalid property', () => {
    expect(RequestBody.validate(bookSchema, { pages: 5, title: '' })).toBe('pages')
    expect(RequestBody.validate(bookSchema, { pages: 250, title: '' })).toBe('title')
    expect(RequestBody.validate(bookSchema, { pages: 5, title: 'title' })).toBe('pages')
  })

  test('should consider subjects as valid', () => {
    expect(RequestBody.validate(bookSchema, { title: 'title', pages: 150 })).toBeNull()
  })
})
