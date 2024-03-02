import { defineConfig } from 'tsup';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  clean: true,
  dts: false,
  entry: ['src/index.ts'],
  format: ['cjs'],
  target: 'esnext',
  minify: isProduction,
  sourcemap: !isProduction,
  noExternal: ['@post-app/database', '@post-app/validation', '@post-app/trpc'],
});
