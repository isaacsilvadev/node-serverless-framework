import InvalidEnvironmentError from '../../../src/nsf/configuration/InvalidEnvironmentError'
import Environment from '../../../src/nsf/configuration/Environment'

test('should return a default instance for jest environment', () => {
  expect(Environment.getDefault().get()).toBe('test')

  expect(Environment.getDefault().isLive()).toBe(false)
  expect(Environment.getDefault().isLocal()).toBe(false)
  expect(Environment.getDefault().isTest()).toBe(true)
})

test('should return a new instance based on given environment value', () => {
  const environment = new Environment('production')

  expect(environment.get()).toBe('production')

  expect(environment.isLive()).toBe(true)
  expect(environment.isLocal()).toBe(false)
  expect(environment.isTest()).toBe(false)
})

test('should return a new instance for local environment', () => {
  const environment = new Environment('LOCAL')

  expect(environment.get()).toBe('local')

  expect(environment.isLive()).toBe(false)
  expect(environment.isLocal()).toBe(true)
  expect(environment.isTest()).toBe(false)
})

test('should throw error for invalid environment value: %s', () => {
  expect(() => new Environment(undefined)).toThrow(InvalidEnvironmentError)
})
