import { createProtoConfig } from '@protoapps/eslint-config-vue';
import { globalIgnores } from 'eslint/config';
import globals from 'globals';
import { version } from 'vue';

export default createProtoConfig(
  { tsconfigRootDir: import.meta.dirname, vueVersion: version },
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
