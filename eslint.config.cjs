// C:\repository\proj-full-stack-backend\eslint.config.cjs
const js = require('@eslint/js');
const globals = require('globals');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
  // Pastas e arquivos fora do lint
  {
    ignores: ['dist/**', 'node_modules/**', 'anterior/**', '**/*.bck*'],
  },

  // Regras recomendadas do ESLint e do typescript-eslint (flat config)
  js.configs.recommended,
  ...tsPlugin.configs['flat/recommended'],

  // Ajustes do projeto para arquivos TypeScript
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // Express usa Request<{}, {}, {}, Query> para params/body vazios
      '@typescript-eslint/no-empty-object-type': ['error', { allowObjectTypes: 'always', allowInterfaces: 'with-single-extends' }],
      // Prefixo _ marca parâmetro obrigatório não usado (ex.: next do errorHandler)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' }],
    },
  },
];
