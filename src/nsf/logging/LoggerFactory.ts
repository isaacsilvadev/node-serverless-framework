import { nanoid } from 'nanoid/non-secure'
import pino, { Logger } from 'pino'
import pretty from 'pino-pretty'

import ApplicationProperties from '../configuration/ApplicationProperties'
import Environment from '../configuration/Environment'

export default class LoggerFactory {
  private static readonly PROPERTY_ENABLED = 'LOGGING_ENABLED'
  private static readonly PROPERTY_LEVEL = 'LOGGING_LEVEL'
  private static readonly PROPERTY_REDACT_CENSOR = 'LOGGING_REDACT_CENSOR'
  private static readonly PROPERTY_REDACT_PATHS = 'LOGGING_REDACT_PATHS'

  static getLogger(loggerName: string): Logger {
    return pino(
      {
        enabled: LoggerFactory.isLoggingEnabled(),
        formatters: {
          level(label: string) {
            return { level: label }
          }
        },
        level: LoggerFactory.getLevel(),
        name: loggerName,
        timestamp: pino.stdTimeFunctions.isoTime,
        ...LoggerFactory.getRedactConfig()
      },
      LoggerFactory.getDestination()
    )
  }

  static newContextId(): string {
    return nanoid(7)
  }

  private static getLevel(): string {
    return ApplicationProperties.get(LoggerFactory.PROPERTY_LEVEL, 'info')
  }

  private static getDestination(): pino.DestinationStream {
    /* istanbul ignore next */
    /* (note: only testable by inspecting stdout or writing a custom pino destination) */
    return Environment.getDefault().isLive() ? pino.destination(1) : pretty()
  }

  /* istanbul ignore next */
  /* (note: only testable by inspecting stdout or writing a custom pino destination) */
  private static getRedactConfig() {
    const redactPaths = ApplicationProperties.getAsArray(LoggerFactory.PROPERTY_REDACT_PATHS, [])

    return redactPaths.length > 0
      ? {
          redact: {
            censor: ApplicationProperties.get(LoggerFactory.PROPERTY_REDACT_CENSOR, '**LGPD COMPLIANT**'),
            paths: redactPaths
          }
        }
      : {}
  }

  private static isLoggingEnabled(): boolean {
    /* istanbul ignore next */
    /* (note: only testable by inspecting stdout or writing a custom pino destination) */
    return ApplicationProperties.getAsBoolean(LoggerFactory.PROPERTY_ENABLED, true)
  }
}
