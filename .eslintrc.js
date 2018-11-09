module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true
  },
  extends: ['eslint:recommended'],

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },

  parser: 'babel-eslint'
}
