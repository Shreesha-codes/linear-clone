import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
    exclude: ['node_modules', 'dist', 'migrations'],
    passWithNoTests: true, // Don't fail when no tests exist
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: ['node_modules/', 'dist/', 'migrations/', '**/*.config.{js,ts}', '**/*.d.ts'],
    },
  },
});
