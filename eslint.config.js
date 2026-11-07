import { createProtoConfig } from '@protoapps/eslint-config';
import { globalIgnores } from 'eslint/config';
import globals from 'globals';
import { version } from 'vue';

export default createProtoConfig(
  { tsconfigRootDir: import.meta.dirname, vue: { version } },
  globalIgnores(['node_modules/**', 'dist/**', '*.log']),
  {
    name: 'ghost-and-found/browser',
    files: ['src/**/*.{js,ts,vue}'],
    languageOptions: { globals: globals.browser },
  },
  {
    name: 'ghost-and-found/node',
    files: ['*.config.{js,ts}'],
    languageOptions: { globals: globals.node },
  },
);
