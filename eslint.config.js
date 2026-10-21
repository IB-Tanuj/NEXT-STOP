import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    'deployment_unused_backup/**',
    'docs/oldspotinfoController.js',
    'scratch/**',
    'Backend/scratch.js',
    'Backend/test-*.js',
    'Backend/test-rapidapi/**',
  ]),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // These effects synchronize async requests, browser APIs, and local
      // storage. React 19's rule flags the intentional state updates inside
      // those subscriptions as cascading renders.
      'react-hooks/set-state-in-effect': 'off',
      // Presentation-only animation values are deliberately generated for a
      // component instance and do not affect application state.
      'react-hooks/purity': 'off',
      // Context modules and UI helper modules intentionally export hooks and
      // constants alongside components.
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['Backend/**/*.js', 'api/**/*.js', 'scripts/**/*.js', '*.config.js'],
    languageOptions: { globals: globals.node },
  },
])
