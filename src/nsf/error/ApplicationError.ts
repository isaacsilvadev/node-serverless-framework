export default class ApplicationError extends Error {
  readonly code: string

  constructor(name: string, code: string, message: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)

    this.name = name
    this.code = code
  }
}
