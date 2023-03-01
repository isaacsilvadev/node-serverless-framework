import { orUndefined } from '../../../src/nsf/common/Functions'

describe('Convert falsy to undefined', () => {
  const valuesToConvert = [null, undefined, false, '', 0]
  const valuesToKeep = ['test', 123, {}, []]

  test.each(valuesToConvert)('should convert correctly: %s', (value) => {
    expect(orUndefined(value)).toBeUndefined()
  })

  test.each(valuesToKeep)('should not convert %s to undefined', (value) => {
    expect(orUndefined(value)).toBe(value)
  })
})
