import { defineConfig } from 'vitest/config';

export default defineConfig({
  cache: {
    dir: 'dist/.vitest-cache',
  },
  test: {
    // collect coverage using v8 provider (fast and modern)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json'],
      reportsDirectory: './coverage',
      all: true,
    },
  },
});

