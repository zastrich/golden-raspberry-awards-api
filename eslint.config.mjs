import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginPrettier from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'

export default [
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      ...configPrettier.rules,
      'prettier/prettier': [
        'error',
        {
          semi: false,
          singleQuote: true,
          endOfLine: 'auto',
        },
      ],
      'eol-last': ['error', 'always'],
      semi: ['error', 'never'],
    },
  },
]
