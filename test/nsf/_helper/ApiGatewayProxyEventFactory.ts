import type {
  APIGatewayProxyEvent,
  APIGatewayProxyEventHeaders,
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyEventQueryStringParameters
} from 'aws-lambda'

type JsonBody = {
  body: string | null
  length: number
}

type EventParameter = {
  body?: any | null
  headers?: APIGatewayProxyEventHeaders
  httpMethod?: string
  path?: string
  pathParameters?: APIGatewayProxyEventPathParameters | null
  queryStringParameters?: APIGatewayProxyEventQueryStringParameters | null
}

export default class ApiGatewayProxyEventFactory {
  static newEvent({
    body = null,
    headers = { Authorization: 'Basic <token>' },
    httpMethod = 'GET',
    path = '/',
    pathParameters = null,
    queryStringParameters = null
  }: EventParameter): APIGatewayProxyEvent {
    const jsonBody: JsonBody = ApiGatewayProxyEventFactory.getJsonBody(body)

    return {
      body: jsonBody.body,
      headers: { 'Content-Lenght': String(jsonBody.length), ...headers },
      httpMethod,
      isBase64Encoded: false,
      multiValueHeaders: {},
      multiValueQueryStringParameters: null,
      path,
      pathParameters,
      queryStringParameters,
      requestContext: {
        authorizer: {},
        accountId: 'accountId',
        apiId: 'apiId',
        protocol: 'HTTP/1.1',
        httpMethod,
        identity: {
          accessKey: 'accessKey',
          accountId: 'accountId',
          apiKey: 'apiKey',
          apiKeyId: 'apiKeyId',
          caller: 'caller',
          clientCert: null,
          cognitoAuthenticationProvider: 'cognitoAuthenticationProvider',
          cognitoAuthenticationType: 'cognitoAuthenticationType',
          cognitoIdentityId: 'cognitoIdentityId',
          cognitoIdentityPoolId: 'cognitoIdentityPoolId',
          principalOrgId: 'principalOrgId',
          sourceIp: 'sourceIp',
          user: 'user',
          userAgent: 'userAgent',
          userArn: 'userArn'
        },
        path,
        stage: 'local',
        requestId: 'requestId',
        requestTimeEpoch: 1658329089201,
        resourceId: 'resourceId',
        resourcePath: path
      },
      resource: 'resource',
      stageVariables: null
    }
  }

  static newDefaultEvent() {
    return this.newEvent({})
  }

  private static getJsonBody(body: any | null): JsonBody {
    if (body === null) {
      return { body: null, length: 0 }
    }

    if (typeof body === 'string' && body.trim().length === 0) {
      return { body: String(body), length: 0 }
    }

    const json: string = JSON.stringify(body)

    return {
      body: json,
      length: json.length
    }
  }
}
