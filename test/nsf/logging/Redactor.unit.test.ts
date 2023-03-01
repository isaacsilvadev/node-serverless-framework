import Redactor from '../../../src/nsf/logging/Redactor'

type TestTable = {
  testName: string
  input: {
    charsToKeep?: number
    defaultIfAbsent?: string
    text: string | null
  }
  output: {
    redacted: string
  }
}

const testTable: TestTable[] = [
  {
    testName: 'should redact a string partially, using default number of chars to keep',
    input: {
      text: 'sensitive information'
    },
    output: {
      redacted: 'sensiti**************'
    }
  },
  {
    testName: 'should redact a string partially, using custom number of chars to keep',
    input: {
      text: 'sensitive information',
      charsToKeep: 3
    },
    output: {
      redacted: 'sen******************'
    }
  },
  {
    testName: 'should redact the whole string when custom number is zero',
    input: {
      text: 'sensitive information',
      charsToKeep: 0
    },
    output: {
      redacted: '*********************'
    }
  },
  {
    testName: 'should redact the whole string when custom number is negative',
    input: {
      text: 'sensitive information',
      charsToKeep: -1
    },
    output: {
      redacted: '*********************'
    }
  },
  {
    testName: 'should return default value for null text',
    input: {
      text: null
    },
    output: {
      redacted: '<empty>'
    }
  },
  {
    testName: 'should return default value for empty text',
    input: {
      text: '',
      charsToKeep: 3
    },
    output: {
      redacted: '<empty>'
    }
  },
  {
    testName: 'should return custom default value for empty text',
    input: {
      text: '',
      defaultIfAbsent: 'NOTHING'
    },
    output: {
      redacted: 'NOTHING'
    }
  },
  {
    testName: 'should redact an string with white space only',
    input: {
      text: '  ',
      charsToKeep: 1
    },
    output: {
      redacted: ' *'
    }
  },
  {
    testName: 'should redact nothing, since charsToKeep in greater than text length',
    input: {
      text: 'no redaction',
      charsToKeep: 99
    },
    output: {
      redacted: 'no redaction'
    }
  }
]

test.each(testTable)(
  '$testName',
  ({
    /* eslint @typescript-eslint/ban-ts-comment: off, @typescript-eslint/no-unused-vars: off */
    // @ts-ignore
    testName,
    input: testInput,
    output: testOutput
  }: TestTable) => {
    expect(Redactor.redact(testInput.text, testInput.charsToKeep, testInput.defaultIfAbsent)).toBe(testOutput.redacted)
  }
)
