import type { JestConfigWithTsJest } from 'ts-jest'
import { defaultsESM as tsjPreset } from 'ts-jest/presets'

const jestConfig: JestConfigWithTsJest = {
  coveragePathIgnorePatterns: ['/test/'],
  extensionsToTreatAsEsm: tsjPreset.extensionsToTreatAsEsm || [],
  moduleDirectories: ['./node_modules', './src'],
  preset: 'ts-jest',
  setupFiles: ['./test/jest.setup.ts'],
  testEnvironment: 'jest-environment-node',
  testPathIgnorePatterns: ['/.build/', '/node_modules/'],
  transform: {
    ...tsjPreset.transform
  },
  verbose: true
}

export default jestConfig
