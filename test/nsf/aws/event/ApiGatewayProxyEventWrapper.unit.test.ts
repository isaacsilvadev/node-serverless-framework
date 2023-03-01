import ApiGatewayProxyEventFactory from '../../_helper/ApiGatewayProxyEventFactory'

import ApiGatewayProxyEventWrapper from '../../../../src/nsf/aws/event/ApiGatewayProxyEventWrapper'

describe('Content length', () => {
  test('should return 0 when content-length is missing', () => {
    expect(new ApiGatewayProxyEventWrapper(ApiGatewayProxyEventFactory.newDefaultEvent()).getContentLength()).toBe(0)
  })

  test('should return the content-length', () => {
    expect(
      new ApiGatewayProxyEventWrapper(
        ApiGatewayProxyEventFactory.newEvent({ body: null, headers: { 'Content-Length': '99' } })
      ).getContentLength()
    ).toBe(99)
  })
})

describe('JSON parse', () => {
  test('should return null, due to missing input', () => {
    expect(new ApiGatewayProxyEventWrapper(ApiGatewayProxyEventFactory.newDefaultEvent()).getBodyAsJson()).toBeNull()
  })

  test('should fail to return body as json, due to invalid input', () => {
    expect(() =>
      new ApiGatewayProxyEventWrapper(
        ApiGatewayProxyEventFactory.newEvent({
          body: BigInt('0b11111111111111111111111111111111111111111111111111111')
        })
      ).getBodyAsJson()
    ).toThrow()
  })

  test('should return body as json', () => {
    expect(
      new ApiGatewayProxyEventWrapper(
        ApiGatewayProxyEventFactory.newEvent({ body: { name: 'Ranni', age: 99 } })
      ).getBodyAsJson()
    ).toStrictEqual({
      name: 'Ranni',
      age: 99
    })
  })

  test('should return null when body is also null or an empty string', () => {
    expect(new ApiGatewayProxyEventWrapper(ApiGatewayProxyEventFactory.newDefaultEvent()).getBodyAsJson()).toBeNull()
    expect(
      new ApiGatewayProxyEventWrapper(ApiGatewayProxyEventFactory.newEvent({ body: '  ' })).getBodyAsJson()
    ).toBeNull()
  })
})

describe('Path', () => {
  test('should return path', () => {
    expect(new ApiGatewayProxyEventWrapper(ApiGatewayProxyEventFactory.newDefaultEvent()).getPath()).toBe('/')
  })
})

describe('Path parameter', () => {
  test('should return a path parameter value', () => {
    // Without path parameters.
    expect(
      new ApiGatewayProxyEventWrapper(ApiGatewayProxyEventFactory.newDefaultEvent()).getPathParameter('userId')
    ).toBeNull()

    // With path parameters.
    const event = new ApiGatewayProxyEventWrapper(
      ApiGatewayProxyEventFactory.newEvent({ pathParameters: { userId: '123' } })
    )

    expect(event.getPathParameter('userId')).toBe('123')
  })
})

describe('Headers', () => {
  test('should return a header value', () => {
    const event = new ApiGatewayProxyEventWrapper(ApiGatewayProxyEventFactory.newEvent({ headers: { header: '123' } }))

    expect(event.getHeader('header')).toBe('123')
    expect(event.getHeader('otherHeader')).toBeNull()
  })
})

describe('Authorization', () => {
  test('should return header Authorization', () => {
    const event = new ApiGatewayProxyEventWrapper(
      ApiGatewayProxyEventFactory.newEvent({ headers: { Authorization: 'Basic <token>' } })
    )

    expect(event.getAuthorization()).toBe('Basic <token>')
  })
})
