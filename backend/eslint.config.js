module.exports = [
  {
    ignores: ["coverage/**", "node_modules/**"]
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: { require: "readonly", module: "readonly", process: "readonly", console: "readonly", exports: "readonly" }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off"
    }
  }
];