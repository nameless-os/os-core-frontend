module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
  },
  plugins: [
    "@typescript-eslint",
    "prettier"
  ],
  extends: [
    "prettier",
    "react-app",
    "react-app/jest",
    "airbnb-typescript",
    "plugin:cypress/recommended"
  ],
  rules: {
    "object-curly-newline": 0,
    "import/prefer-default-export": 0,
    "max-len": 0,
    "react/require-default-props": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "no-mixed-operators": 0,
    "operator-linebreak": 0,
    "react/react-in-jsx-scope": 0,
    "no-plusplus": 0,
    "jsx-a11y/no-autofocus": 0,
    "react/jsx-props-no-spreading": 0,
    "no-continue": 0,
    "react/jsx-no-bind": 0,
    "react-hooks/exhaustive-deps": 0,
    "no-param-reassign": ['error', { props: true, ignorePropertyModificationsFor: ['state'] }],
    "testing-library/no-unnecessary-act": 0
  }
};
