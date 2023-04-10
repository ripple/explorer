module.exports = {
  plugins: ['stylelint-scss'],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-scss',
    'stylelint-config-idiomatic-order',
  ],
  rules: {
    'at-rule-empty-line-before': null,
    'block-closing-brace-newline-after': null,
    'import-notation': 'string',
    'length-zero-no-unit': null,
  },
}
