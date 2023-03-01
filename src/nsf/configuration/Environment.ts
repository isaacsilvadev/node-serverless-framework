import InvalidEnvironmentError from './InvalidEnvironmentError'

export default class Environment {
  private static cached: Environment | undefined
  private readonly value: string

  constructor(value: string | undefined) {
    if (value === undefined) {
      throw new InvalidEnvironmentError('undefined')
    }

    this.value = value.toLowerCase()
  }

  static getDefault(): Environment {
    if (Environment.cached !== undefined) {
      return Environment.cached
    }

    Environment.cached = new Environment(process.env['NODE_ENV'])
    return Environment.cached
  }

  static clearCache() {
    Environment.cached = undefined
  }

  get(): string {
    return this.value
  }

  isLive(): boolean {
    return !this.isLocal() && !this.isTest()
  }

  isLocal(): boolean {
    return this.get() === 'local'
  }

  isTest(): boolean {
    return this.get() === 'test'
  }
}
