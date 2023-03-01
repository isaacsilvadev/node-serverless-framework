import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import type { Logger } from 'pino'

import AbstractClientProvider from '../../common/AbstractClientProvider'
import ApplicationProperties from '../../../nsf/configuration/ApplicationProperties'
import Environment from '../../../nsf/configuration/Environment'
import LoggerFactory from '../../../nsf/logging/LoggerFactory'

const logger = LoggerFactory.getLogger('dynamoDbClientProvider')

export default class DynamoDbClientProvider extends AbstractClientProvider<DynamoDBDocument> {
  private readonly environment: Environment

  constructor(environment: Environment = Environment.getDefault()) {
    super('DynamoDB')
    this.environment = environment
  }

  newInstance(): DynamoDBDocument {
    return DynamoDBDocument.from(new DynamoDBClient(this.getOptions()), {
      marshallOptions: {
        convertClassInstanceToMap: true,
        removeUndefinedValues: true
      }
    })
  }

  getLogger(): Logger {
    return logger
  }

  private getOptions(): DynamoDBClientConfig {
    return {
      ...(!this.environment.isLive() && {
        endpoint: ApplicationProperties.get('AWS_DYNAMODB_ENDPOINT', 'http://localhost:8000'),
        region: ApplicationProperties.get('AWS_DYNAMODB_REGION', 'us-east-1'),
        credentials: {
          accessKeyId: 'fakeAccessKeyId',
          secretAccessKey: 'fakeSecretAccessKey'
        }
      })
    }
  }
}
