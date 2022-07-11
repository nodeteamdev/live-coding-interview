module.exports = {
  env: {
    es2021: true,
    node: true,
    browser: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'class-methods-use-this': 'off',
    'no-unused-vars': 'off',
    'no-underscore-dangle': 'off',
    'no-useless-constructor': 'off',
    'no-empty-function': 'off',
  },
  globals: {
    window: true,
    document: true,
    M: true,
    $: true,
    CodeMirror: true,
    io: true,
  },
};
