import tseslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import unusedImports from "eslint-plugin-unused-imports";

export default [
  {
    files: ['**/*.ts'],
    ignores: ['dist/**', 'node_modules/**', '../backend/**'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'unused-imports': unusedImports  // Keep this
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    rules: {
      // TypeScript-specific rules
      '@typescript-eslint/explicit-member-accessibility': ['warn', {
        accessibility: 'no-public'
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',

      // Code readability and formatting
      'arrow-parens': ['warn', 'always'],
      'no-console': 'warn',
      'no-debugger': 'warn',
      'indent': ['warn', 2, { SwitchCase: 1 }],
      'quotes': ['warn', 'single', { avoidEscape: true }],
      'semi': ['warn', 'always'],
      "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
          "warn",
          {
              "vars": "all",
              "varsIgnorePattern": "^_",
              "args": "after-used",
              "argsIgnorePattern": "^_",
          },
      ]
    }
  }
];