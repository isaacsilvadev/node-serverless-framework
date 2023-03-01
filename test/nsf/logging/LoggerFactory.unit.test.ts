import LoggerFactory from '../../../src/nsf/logging/LoggerFactory'

describe('Logger creation', () => {
  const loggingEnabled = process.env['LOGGING_ENABLED']

  beforeAll(() => {
    process.env['LOGGING_ENABLED'] = 'true'
  })

  afterAll(() => {
    process.env['LOGGING_ENABLED'] = loggingEnabled
  })

  test('should create a logger with the default log level', () => {
    const loggingLevel = process.env['LOGGING_LEVEL']
    delete process.env['LOGGING_LEVEL']

    const logger = LoggerFactory.getLogger('jest')
    expect(logger.level).toBe('info')
    expect(logger.isLevelEnabled('info')).toBe(true)
    expect(logger.isLevelEnabled('debug')).toBe(false)

    process.env['LOGGING_LEVEL'] = loggingLevel
  })

  test('should create a logger with the log level specified in the environment', () => {
    const loggingLevel = 'trace'
    process.env['LOGGING_LEVEL'] = loggingLevel

    const logger = LoggerFactory.getLogger('jest')
    expect(logger.level).toBe(loggingLevel)
    expect(logger.isLevelEnabled(loggingLevel)).toBe(true)
  })
})

describe('Context ID', () => {
  test('should create a new context id', () => {
    expect(LoggerFactory.newContextId()).toEqual(expect.stringMatching(/^[A-Za-z0-9_-]{7}$/))
  })
})
