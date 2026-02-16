import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  outDir: 'dist',
  sourcemap: true,
  minify: true,
  clean: true,
  platform: 'node',
  target: 'node20',
  // Bundle all dependencies
  noExternal: [/.*/],
  // Ensure proper ESM output
  outExtension() {
    return {
      js: '.mjs',
    };
  },
  // Add banner to polyfill require for ESM
  banner: {
    js: `import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);`,
  },
});
