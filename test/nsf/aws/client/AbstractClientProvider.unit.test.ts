import type { Logger } from 'pino'

import AbstractClientProvider from '../../../../src/nsf/common/AbstractClientProvider'
import LoggerFactory from '../../../../src/nsf/logging/LoggerFactory'

class TestClientProvider extends AbstractClientProvider<string> {
  private static IS_REPLAY = false

  constructor() {
    super('Test')
  }

  static rewind() {
    TestClientProvider.IS_REPLAY = false
  }

  newInstance(): string {
    if (!TestClientProvider.IS_REPLAY) {
      TestClientProvider.IS_REPLAY = true
      return 'original instance'
    } else {
      return 'replay instance'
    }
  }

  getLogger(): Logger {
    return LoggerFactory.getLogger('testClientProvider')
  }
}

beforeEach(() => TestClientProvider.rewind())

test('should create a new instance of client provider', () => {
  const clientProvider = new TestClientProvider()
  expect(clientProvider.get()).toBe('original instance')
})

test('should create a two different instances of client provider, by clearing cache', () => {
  const clientProvider = new TestClientProvider()
  expect(clientProvider.get()).toBe('original instance')
  expect(clientProvider.get()).toBe('original instance')

  clientProvider.clearCache()
  expect(clientProvider.get()).toBe('replay instance')
})
