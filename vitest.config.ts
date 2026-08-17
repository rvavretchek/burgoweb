import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts', 'apps/**/*.test.{ts,tsx}'],
    exclude: ['cypress/**', 'node_modules/**'],
    testTimeout: 15_000,
  },
});
