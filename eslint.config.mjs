import stylistic from "@stylistic/eslint-plugin";
import typescriptEslintParser from "@typescript-eslint/parser";
import stylisticDefault from "stylistic-default";

export default [
  {
    files: [
      "src/**/*.ts",
      "eslint.config.mjs",
    ],

    plugins: {
      "@stylistic": stylistic,
    },

    languageOptions: {
      parser: typescriptEslintParser,
    },

    rules: {
      ...stylisticDefault,
    },
  },
];
