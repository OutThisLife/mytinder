const { resolve } = require('path')

const tsconfigRootDir = __dirname
const project = resolve(tsconfigRootDir, 'tsconfig.eslint.json')

module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  overrides: [
    {
      files: [
        './*.js',
        'pages/api/*.js',
        './scripts/**/*.js',
        './test/**/*.js'
      ],
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { project, tsconfigRootDir },
  plugins: [
    'sort-keys-fix',
    'sort-destructure-keys',
    '@typescript-eslint',
    'better-styled-components'
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': 1,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-shadow': ['warn'],
    '@typescript-eslint/no-shadow': 1,
    '@typescript-eslint/no-unused-vars': ['error'],
    'better-styled-components/sort-declarations-alphabetically': 2,
    'import/no-anonymous-default-export': 0,
    'no-shadow': 0,
    'no-unused-vars': 'off',
    'padding-line-between-statements': [
      1,
      {
        blankLine: 'always',
        next: [
          'block-like',
          'block',
          'return',
          'if',
          'class',
          'continue',
          'debugger',
          'break',
          'multiline-const',
          'multiline-let'
        ],
        prev: '*'
      },
      {
        blankLine: 'always',
        next: '*',
        prev: [
          'case',
          'default',
          'multiline-const',
          'multiline-let',
          'multiline-block-like'
        ]
      },
      {
        blankLine: 'never',
        next: ['block', 'block-like'],
        prev: ['case', 'default']
      },
      {
        blankLine: 'always',
        next: ['block', 'block-like'],
        prev: ['block', 'block-like']
      },
      {
        blankLine: 'always',
        next: ['empty'],
        prev: 'export'
      },
      {
        blankLine: 'never',
        next: 'iife',
        prev: ['block', 'block-like', 'empty']
      }
    ],
    'react/default-props-match-prop-types': 0,
    'react/jsx-props-no-spreading': 0,
    'react/jsx-sort-props': 2,
    'react/no-array-index-key': 0,
    'react/no-danger': 0,
    'react/react-in-jsx-scope': 0,
    'react/require-default-props': 0,
    'sort-destructure-keys/sort-destructure-keys': 2,
    'sort-keys-fix/sort-keys-fix': 2
  }
}
