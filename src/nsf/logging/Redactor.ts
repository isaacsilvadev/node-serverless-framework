export default class Redactor {
  static DEFAULT_CHARS_TO_KEEP = 7
  static DEFAULT_IF_ABSENT = '<empty>'

  private static readonly PAD_CHAR = '*'

  static redact(
    text: string | null,
    charsToKeep: number = Redactor.DEFAULT_CHARS_TO_KEEP,
    defaultIfAbsent: string = Redactor.DEFAULT_IF_ABSENT
  ): string {
    if (text === undefined || text === null || text.length === 0) {
      return defaultIfAbsent
    }

    if (0 > charsToKeep) {
      return Redactor.PAD_CHAR.repeat(text.length)
    }

    if (text.length <= charsToKeep) {
      return text
    }

    return text.substring(0, charsToKeep).padEnd(text.length, Redactor.PAD_CHAR)
  }
}
