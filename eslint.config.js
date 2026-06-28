import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

const nodeGlobals = {
  Buffer: 'readonly',
  console: 'readonly',
  process: 'readonly',
  URL: 'readonly',
  URLSearchParams: 'readonly',
};

export default [
  {
    ignores: [
      'node_modules/**',
      'docs/.vitepress/dist/**',
      'docs/reference/api/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: nodeGlobals,
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  eslintConfigPrettier,
];
