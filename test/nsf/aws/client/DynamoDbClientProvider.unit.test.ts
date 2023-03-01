import type { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

import DynamoDbClientProvider from '../../../../src/nsf/aws/client/DynamoDbClientProvider'
import ApplicationProperties from '../../../../src/nsf/configuration/ApplicationProperties'
import Environment from '../../../../src/nsf/configuration/Environment'

beforeEach(() => Environment.clearCache())

test('should generate the same instance, with the same options', () => {
  const clientProvider = new DynamoDbClientProvider()
  expect(clientProvider.get()).toStrictEqual(clientProvider.get())
})

/* eslint @typescript-eslint/no-non-null-assertion: off */
test('should generate a different instance, one with test env options and the other with live env options', async () => {
  // Test env instance.
  const testEnvInstance: DynamoDBDocument = new DynamoDbClientProvider().get()
  const endpointUrl = new URL(ApplicationProperties.get('AWS_DYNAMODB_ENDPOINT'))

  await expect(testEnvInstance.config.endpoint!()).resolves.toStrictEqual({
    hostname: endpointUrl.hostname,
    path: endpointUrl.pathname,
    port: parseInt(endpointUrl.port),
    protocol: endpointUrl.protocol,
    query: undefined
  })

  await expect(testEnvInstance.config.region()).resolves.toBe(ApplicationProperties.get('AWS_DYNAMODB_REGION'))

  // Live env instance.
  const liveEnvInstance: DynamoDBDocument = new DynamoDbClientProvider(new Environment('production')).get()
  expect(liveEnvInstance.config.endpoint).toBeUndefined()
})
