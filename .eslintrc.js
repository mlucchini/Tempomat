module.exports = {
  root: true,
  extends: `@react-native-community`,
  parser: `@typescript-eslint/parser`,
  plugins: [`@typescript-eslint`],
  rules: {
    quotes: [`error`, `backtick`],
    semi: [2, `never`],
    "prefer-const": 0,
  },
}
