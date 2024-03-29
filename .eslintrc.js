const { resolve } = require('path')
const config = require('eslint-config-airbnb-base/rules/style')

const tsconfig = resolve(__dirname, 'tsconfig.json')

module.exports = {
  root: true,

  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],

  plugins: ['simple-import-sort'],

  parserOptions: {
    project: tsconfig,
  },

  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },

    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: [tsconfig],
      },
    },
  },

  plugins: ['simple-import-sort', 'unused-imports'],

  overrides: [
    {
      files: [
        './src/app/entry.*.tsx',
        './src/app/root.tsx',
        './src/app/routes/**/*.ts{,x}',
      ],
      rules: {
        'import/no-default-export': 'off',
        'import/prefer-default-export': 'error',
      },
    },
  ],

  rules: {
    'no-console': 'off',
    'import/order': 'off',

    // It's helpful to split functionality into multiple functions within a class.
    'class-methods-use-this': 'off',

    // Throws errors for exported functions, which is a common pattern with ES modules.
    '@typescript-eslint/unbound-method': 'off',

    // Named exports are nicer to work with for a variety of reasons:
    // https://basarat.gitbook.io/typescript/main-1/defaultisbad
    'import/no-default-export': 'error',
    'import/prefer-default-export': 'off',

    // Let ESlint sort our imports for us so we don't have to think about it.
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',

    // Allow for-of loops since most browsers support it now.
    'no-restricted-syntax': config.rules['no-restricted-syntax'].filter(
      (rule) => rule.selector !== 'ForOfStatement',
    ),

    // Sometimes it's safe to call async functions and not handle their errors.
    '@typescript-eslint/no-misused-promises': 'off',

    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    // React import not needed
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
  },
}
