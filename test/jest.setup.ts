export {}

const testProperties: { [key: string]: string } = {
  AWS_DYNAMODB_ENDPOINT: 'http://localhost:7999',
  AWS_DYNAMODB_REGION: 'sa-east-1',
  CORS_ALLOW_ORIGIN: 'https://jest:9999/',
  LOGGING_LEVEL: 'silent'
}

for (const key in testProperties) {
  process.env[key] = testProperties[key]
}
