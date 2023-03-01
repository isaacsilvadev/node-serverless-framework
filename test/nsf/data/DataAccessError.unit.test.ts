import DataAccessError from '../../../src/nsf/data/DataAccessError'
import ApplicationError from '../../../src/nsf/error/ApplicationError'

test('should throw an error with a number message as string', () => {
  expect(() => {
    throw new DataAccessError(99)
  }).toThrow('99')
})

test('should thow an error with a text message', () => {
  expect(() => {
    throw new DataAccessError('text message')
  }).toThrow('text message')
})

test('should throw an error with the message of another error', () => {
  expect(() => {
    throw new DataAccessError(new Error('standard error'))
  }).toThrow('[Error] standard error')
})

test('should throw an error with the message of an application error', () => {
  expect(() => {
    throw new DataAccessError(new ApplicationError('ApplicationError', 'ERR-999', 'an application error'))
  }).toThrow('[ERR-999] an application error')
})
