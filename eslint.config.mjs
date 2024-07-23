import stylisticEslintPlugin from "@stylistic/eslint-plugin";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import typescriptEslintParser from "@typescript-eslint/parser";
import myEslintRules from "my-eslint-rules";

export default [
  {
    files: [
      "src/**/*.ts",
      "eslint.config.mjs",
    ],

    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
      "@stylistic": stylisticEslintPlugin,
    },

    languageOptions: {
      parser: typescriptEslintParser,
    },

    rules: {
      ...myEslintRules,
    },
  },
];
