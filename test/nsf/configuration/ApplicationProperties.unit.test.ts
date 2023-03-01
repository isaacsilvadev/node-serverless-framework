import ApplicationPropertyMissingError from '../../../src/nsf/configuration/ApplicationPropertyMissingError'
import ApplicationProperties from '../../../src/nsf/configuration/ApplicationProperties'

type TestTable = {
  testName: string
  input: any
  output: string
}

describe('Property retrieval and default value', () => {
  // Source: https://developer.mozilla.org/en-US/docs/Glossary/Falsy
  const testTable: TestTable[] = [
    {
      testName: 'false',
      input: false,
      output: 'false'
    },
    {
      testName: '0',
      input: 0,
      output: '0'
    },
    {
      testName: '-0',
      input: -0,
      output: '0'
    },
    {
      testName: '0n',
      input: BigInt(0),
      output: '0'
    },
    {
      testName: '<empty string>',
      input: '',
      output: ''
    },
    {
      testName: 'null',
      input: null,
      output: 'null'
    },
    {
      testName: 'undefined',
      input: undefined,
      output: 'undefined'
    },
    {
      testName: 'NaN',
      input: NaN,
      output: 'NaN'
    }
  ]

  test('should return jest configuration for node env', () => {
    expect(ApplicationProperties.get('NODE_ENV')).toBe('test')
  })

  test.each(testTable)(
    'should return falsy values for an existing property: $testName',
    ({
      /* eslint @typescript-eslint/ban-ts-comment: off, @typescript-eslint/no-unused-vars: off */
      // @ts-ignore
      testName,
      input: testInput,
      output: testOutput
    }: TestTable) => {
      const propertyName = 'A_FALSY_PROPERTY'
      process.env[propertyName] = String(testInput)

      expect(ApplicationProperties.get(propertyName)).toBe(testOutput)

      delete process.env[propertyName]
    }
  )

  test('should throw an error for a missing property', () => {
    expect(() => ApplicationProperties.get('MISSING_PROPERTY')).toThrow(ApplicationPropertyMissingError)
    expect(() => ApplicationProperties.getAsBoolean('MISSING_PROPERTY')).toThrow(ApplicationPropertyMissingError)
    expect(() => ApplicationProperties.getAsInt('MISSING_PROPERTY')).toThrow(ApplicationPropertyMissingError)
  })

  test('should return the default value for a missing property', () => {
    expect(ApplicationProperties.get('MISSING_PROPERTY', 'default-value')).toBe('default-value')
    expect(ApplicationProperties.getAsBoolean('MISSING_PROPERTY', true)).toBe(true)
    expect(ApplicationProperties.getAsInt('MISSING_PROPERTY', 2502)).toBe(2502)
  })
})

describe('Property value conversion', () => {
  test('should return a property value as integer', () => {
    process.env['AN_INTEGER_PROPERTY'] = '2502'

    expect(ApplicationProperties.get('AN_INTEGER_PROPERTY')).toBe('2502')
    expect(ApplicationProperties.getAsInt('AN_INTEGER_PROPERTY')).toBe(2502)

    delete process.env['AN_INTEGER_PROPERTY']
  })

  test('should return a property value as boolean', () => {
    process.env['A_NATURAL_TRUTHY_PROPERTY'] = 'true'
    process.env['AN_UNCOMMON_TRUTHY_PROPERTY'] = 'this is true'

    process.env['A_NATURAL_FALSY_PROPERTY'] = 'FALSE'
    process.env['ANOTHER_NATURAL_FALSY_PROPERTY'] = '0'

    expect(ApplicationProperties.getAsBoolean('A_NATURAL_TRUTHY_PROPERTY')).toBe(true)
    expect(ApplicationProperties.getAsBoolean('AN_UNCOMMON_TRUTHY_PROPERTY')).toBe(true)

    expect(ApplicationProperties.getAsBoolean('A_NATURAL_FALSY_PROPERTY')).toBe(false)
    expect(ApplicationProperties.getAsBoolean('ANOTHER_NATURAL_FALSY_PROPERTY')).toBe(false)

    delete process.env['A_NATURAL_TRUTHY_PROPERTY']
    delete process.env['AN_UNCOMMON_TRUTHY_PROPERTY']
    delete process.env['A_NATURAL_FALSY_PROPERTY']
    delete process.env['ANOTHER_NATURAL_FALSY_PROPERTY']
  })

  test('should return a property value as a string array', () => {
    process.env['A_NON_LIST'] = 'Item 1; Item 2; Item 3'
    process.env['A_TRUE_LIST'] = 'Item 1, , Item 3, Item 4'

    const aNonList: string[] = ApplicationProperties.getAsArray('A_NON_LIST')
    expect(aNonList).toHaveLength(1)
    expect(aNonList).toStrictEqual(['Item 1; Item 2; Item 3'])

    const aTrueList: string[] = ApplicationProperties.getAsArray('A_TRUE_LIST')
    expect(aTrueList).toHaveLength(3)
    expect(aTrueList).toStrictEqual(['Item 1', 'Item 3', 'Item 4'])

    expect(ApplicationProperties.getAsArray('A_NON_EXISTENT_LIST', ['a', 'b', '', 'd'])).toStrictEqual(['a', 'b', 'd'])
    expect(ApplicationProperties.getAsArray('A_NON_EXISTENT_LIST', [])).toStrictEqual([])

    delete process.env['A_NON_LIST']
    delete process.env['A_TRUE_LIST']
  })
})
