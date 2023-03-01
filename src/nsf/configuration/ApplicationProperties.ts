import ApplicationPropertyMissingError from './ApplicationPropertyMissingError'

export default class ApplicationProperties {
  private static readonly ARRAY_PROPERTY_SEPARATOR: string = ','

  static get<T = string>(propertyName: string, defaultValue?: T): string {
    if (defaultValue === undefined && !(propertyName in process.env)) {
      throw new ApplicationPropertyMissingError(propertyName)
    }

    if (process.env[propertyName] === '') {
      return ''
    }

    return process.env[propertyName] || String(defaultValue) || ''
  }

  static getAsBoolean(propertyName: string, defaultValue: boolean | undefined = undefined): boolean {
    const rawPropertyValue = ApplicationProperties.get(propertyName, defaultValue)

    if (rawPropertyValue === String(defaultValue)) {
      return Boolean(defaultValue)
    }

    const propertyValue = rawPropertyValue.trim().toLowerCase()
    return propertyValue !== 'false' && propertyValue !== '0'
  }

  static getAsInt(propertyName: string, defaultValue: number | undefined = undefined): number {
    return parseInt(ApplicationProperties.get(propertyName, defaultValue))
  }

  static getAsArray(propertyName: string, defaultValue: string[] | undefined = undefined): string[] {
    return ApplicationProperties.get(propertyName, defaultValue?.join(ApplicationProperties.ARRAY_PROPERTY_SEPARATOR))
      .split(ApplicationProperties.ARRAY_PROPERTY_SEPARATOR)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }
}
