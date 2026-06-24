/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'e2e', '.husky'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.config.*',
        '**/*.d.ts',
        'src/test/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
        // Pure shell wrappers — exercised by integration / E2E only:
        'src/App.tsx',
        'src/i18n/i18n.ts',
        'src/api/client.ts',
        'src/theme/cssVars.css',
        // Layout shell + AppShell + nav — covered by Playwright E2E (Step 24)
        'src/routes/ProtectedLayout.tsx',
      ],
      thresholds: {
        lines: 80,
        branches: 70,
        functions: 70,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
