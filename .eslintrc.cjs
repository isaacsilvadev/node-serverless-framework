module.exports = {
    env: {
      es2015: true,
      node: true,
      'jest/globals': true
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:jest/recommended',
      'plugin:node/recommended',
      'plugin:prettier/recommended',
      'plugin:promise/recommended'
    ],
    ignorePatterns: ['coverage/*', '.eslintrc.cjs', 'jest-dynamodb-config.js', 'jest.config.ts'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'es5',
      lib: ['es2015'],
      project: ['./tsconfig.json'],
      tsconfigRootDir: __dirname,
      sourceType: 'module'
    },
    plugins: ['@typescript-eslint', 'jest', 'prettier'],
    root: true,
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'node/no-missing-import': 'off',
      'node/no-unpublished-import': 'off',
      'node/no-unsupported-features/es-syntax': [
        'error',
        {
          ignores: ['modules']
        }
      ],
      'space-before-function-parent': 0
    },
    settings: {
      'import/resolver': {
        typescript: []
      }
    }
  }
  