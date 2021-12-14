module.exports = {
  env: {
    browser: true,
  },
  extends: ["airbnb", "plugin:prettier/recommended", "prettier/react"],
  plugins: ["babel"],
  rules: {
    "prettier/prettier": ["warn"],
    "import/prefer-default-export": "off",
    "prefer-destructuring": "off",
    "prefer-template": "off",
    "react/prop-types": "off",
    "react/destructuring-assignment": "off",
    "no-console": "off",
    "no-underscore-dangle": "off",
    "no-prototype-builtins": "off",
    "jsx-a11y/accessible-emoji": ["off"],
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
};
