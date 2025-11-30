module.exports = {
  root: true,
  ignorePatterns: ['dist/**', 'coverage/**', 'docs/**', 'node_modules/**'],
  env: {
    node: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  rules: {},
  overrides: [
    {
      files: ['test/**/*.ts', '**/*.test.ts'],
      rules: {
        // Tests frequently use require() and ts-ignore to emulate build/test-time behaviors;
        // allow those constructs in test files so lint doesn't fail the CI for test-only patterns.
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/ban-ts-comment': 'off'
      }
    }
    ,
    {
      files: ['vitest.config.ts', '*.config.ts'],
      rules: {
        // config files often import dev-only modules that ESLint's resolver may not find
        'import/no-unresolved': 'off'
      }
    }
  ],
};
