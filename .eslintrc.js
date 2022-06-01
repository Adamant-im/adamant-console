module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
  },
  env: {
    commonjs: true,
    es2020: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  rules: {
    'no-restricted-syntax': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'default-param-last': 'off',
  },
};
