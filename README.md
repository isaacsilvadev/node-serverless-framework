# Node Serverless Template
### Descrição
NSF (Node.js + Serverless Framework/Fundamentals) é um conjunto de componentes que visa simplificar o desenvolvimento de aplicações deste tipo. Neste momento estes componentes estão presentes dentro da aplicação, no pacote nsf. O objetivo no futuro é criar um pacote separado, para que ele possa evoluir de forma independente e possa ser utilizado por outras
aplicações, sem a necessidade de duplicar código.

### Dependências

- ajv: validação de JSON
- aws-sdk: AWS SDK
- nanoid: gera IDs randômicos
- pino: logging

# Componentes

aws
- **apiGateway**: padronização de handlers, o tratamento de suas requisições e respostas
- **client**: padronização dos clients de libs da AWS
- **event**: wrapper de eventos recebidos por uma função lambda, com funções para acesso padronizado às informações

```javascript
// apiGateway: validação usando ajv
const invalidAttribute: string | null = RequestBody.validate(schema, requestBody)

// apiGateway: resposta de serviço
return ResponseFactory.noContent()

// client: obtendo o client do dynamodb
const dbClient: DynamoDBDocument = new DynamoDbClientProvider().get()

// event: obtendo o json da requisição
const json = new ApiGatewayProxyEventWrapper(apiGatewayEvent).getBodyAsJson()
```

functions
funções comuns
```javascript
orUndefined(null) => undefined
orUndefined('test') => 'test'
```

configuration
- **ApplicationProperties**: obtém configurações de ambiente (lendo process.env) e lança um erro quando não as encontra e nenhum valor padrão foi informado
- **Environment**: identifica o ambiente onde a aplicação está sendo executada

```javascript
// retorna uma configuração de ambiente como inteiro, lançando erro caso não seja encontrada.
ApplicationProperties.getAsInt('DAYS_TO_EXPIRE')

// retorna uma configuração de ambiente com boolean ou um valor padrão caso não seja encontrada.
ApplicationProperties.getAsBoolean('ENABLE_AUDIT', false)

// determina se o ambiente é dev/hml/prd
Environment.isLive()
```

### data
Wrapper de erro de acesso à dados.

```javascript
// encapsula o erro, seja qual for seu tipo.
try {
 ...
} catch (error: any) {
 throw new DataAccessError(error)
}
```

error
- **ApplicationError**: classe do tipo **Error** comum para todas outras da aplicação, melhorando o tratamento de erros ao trabalhar em conjunto com **aws/apiGateway/ResponseErrorHandler**
- **ApplicationErrorCode**: códigos de erro globais, não específicos da aplicação

```javascript
export default class InvalidEnvironmentError extends ApplicationError {
 	constructor(value: string) {
 		super('InvalidEnvironmentError', ApplicationErrorCode.ILLEGAL_ARGUMENT, value)
 	}
}
```

### logging
- **LoggerFactory**: cria um instância do logger do pino
- **Redactor**: funções para ofuscar informações para logging

```javascript
// obtém uma instância do logger.
LoggerFactory,getLogger('loggerName')

// ofusca o texto.
Redactor.redact('sensitive information') => 'sensiti**************'
```

### Códigos de erro
- **APP-000**: desconhecido
- **APP-001**: propriedade de aplicação não encontrado (**ApplicationProperties.get(propertyName)** não encontra
**propertyName**)
- **APP-002**: argumento inválido (função ou construtor recebe um argumento cujo tipo não é permitido)
- **APP-003**: atributo de requisição inválido e não mapeado
- **APP-004**: erro ao acessar algum repositório de dados
- **APP-005**: parâmetro não encontrado na Parameter Store (**ParameterStore.get(parameterName)** não encontra
**parameterName**)