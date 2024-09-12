module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:vue/vue3-essential', 'prettier'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'vue'],
  rules: {
    indent: ['warn', 2, { SwitchCase: 1 }],
    'linebreak-style': ['warn', 'unix'],
    quotes: ['warn', 'single', { avoidEscape: true }],
    semi: ['warn', 'never'],
    'no-undef': 'off',
    'vue/component-tags-order': [
      'warn',
      {
        order: ['script', 'template', 'style'],
      },
    ],
  },
  /**
   * We ignore VuePrime TailwindCSS Presets because we'd rather
   * not mess around with the generated code
   * @see https://tailwind.primevue.org/builder/
   */
  ignorePatterns: ['src/assets/css/presets/**/*.js'],
}
