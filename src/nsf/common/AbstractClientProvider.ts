import type { Logger } from 'pino'

export default abstract class AbstractClientProvider<T> {
  private cached: T | undefined
  private readonly serviceName

  abstract newInstance(): T
  abstract getLogger(): Logger

  constructor(serviceName: string) {
    this.serviceName = serviceName
  }

  clearCache() {
    this.cached = undefined
  }

  get(): T {
    if (this.cached !== undefined) {
      this.getLogger().trace('Returning cached instance of %s client; ignoring environment', this.serviceName)
      return this.cached
    }

    this.getLogger().debug('Creating a new instance of %s client', this.serviceName)

    this.cached = this.newInstance()
    return this.cached
  }
}
