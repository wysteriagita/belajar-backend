import js from '@eslint/js';
import globals from 'globals';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // 1. Abaikan folder build atau modul pihak ketiga
  {
    ignores: ['node_modules/', 'dist/', 'prisma/'],
  },

  // 2. Konfigurasi dasar untuk file JavaScript
  js.configs.recommended,

  // 3. Konfigurasi kustom untuk runtime modern Anda
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module', // Mendukung ES Modules (import/export)
      globals: {
        ...globals.node, // Mengenali env Node.js (process, module, dll)
        ...globals.es2021, // Mengenali fitur JS Modern
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Menjadikan error formatting Prettier sebagai error di ESLint
      'prettier/prettier': 'error',

      // Aturan kualitas kode tambahan untuk kebersihan layered architecture
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off', // Diizinkan karena kustom logger/vps butuh log dasar
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
    },
  },

  // 4. Integrasi terakhir untuk mematikan aturan yang konflik dengan Prettier
  eslintConfigPrettier,
];
