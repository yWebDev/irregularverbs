// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const jsonModule = require("@eslint/json");
const json = jsonModule.default ?? jsonModule;
const i18nLocalePlugin = require("./eslint-plugins/i18n-locale-structure.cjs");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "@angular-eslint/prefer-standalone": "error",
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      "@angular-eslint/template/prefer-control-flow": "warn",
    },
  },
  {
    files: ["src/assets/i18n/*.json"],
    plugins: {
      json,
      "i18n-locale": i18nLocalePlugin,
    },
    language: "json/json",
    rules: {
      "json/no-duplicate-keys": "error",
      "json/no-empty-keys": "error",
      "json/no-unnormalized-keys": "error",
      "json/no-unsafe-values": "error",
      "i18n-locale/locale-structure": "error",
    },
  },
);
