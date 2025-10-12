import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import prettierPlugin from 'eslint-plugin-prettier'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import importPlugin from 'eslint-plugin-import'

export default [
  {
    // Flat config: ignore patterns
    ignores: [
      'node_modules',
      'scripts/*',
      'config/*',
      'pnpm-lock.yaml',
      'pnpm-workspace.yaml',
      '.DS_Store',
      'package.json',
      'tsconfig.json',
      '**/*.md',
      'build',
      '.eslintrc.cjs',
      'eslint.config.js',
      '**/.*', // Ignore all dotfiles (like .gitignore),
      'src/routeTree.gen.ts',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    // Language options (ES Modules, JSX)
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 2021, // ES2021 syntax support
      sourceType: 'module',
      globals: {
        window: 'readonly', // For browser-based globals
        document: 'readonly',
        Edit: 'writable',
        console: 'writable',
        _: 'writable',
        $: 'writable',
      },
    },

    // Plugins to be used
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
      '@typescript-eslint': typescriptPlugin,
      'react-refresh': reactRefreshPlugin,
      import: importPlugin,
    },

    // ESLint rule configurations (extends equivalent in Flat Config)
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...typescriptPlugin.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,
      'prettier/prettier': 'error', // Prettier formatting as an ESLint rule
      // React 17+ automatic JSX runtime
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      // Allow unnamed inline components
      'react/display-name': 'off',
    },

    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
  },
]
