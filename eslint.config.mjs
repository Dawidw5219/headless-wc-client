// pnpm add -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-sonarjs
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import sonarjs from "eslint-plugin-sonarjs";

export default [
  {
    ignores: [
      "dist/**",
      "server/**",
      "node_modules/**",
      ".parcel-cache/**",
      "src/components/shadcn/**",
      "src/ui/shadcn/**",
    ],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        // Make eslint use local tsconfig for this package
        project: ["./tsconfig.json"],
        projectService: false,
      },
    },
    plugins: { "@typescript-eslint": tsPlugin, sonarjs },
    rules: {
      ...(sonarjs.configs?.recommended?.rules ?? {}),
      "no-console": ["warn", { allow: ["error"] }],
      "no-inline-comments": "warn",
      "sonarjs/cognitive-complexity": ["error", 15],
      "no-nested-ternary": "error",
      "max-depth": ["error", 4],
      "max-nested-callbacks": ["error", 3],
      complexity: ["error", { max: 12 }],
      "max-params": ["error", 5],
      eqeqeq: "error",
      "max-lines": [
        "error",
        { max: 400, skipBlankLines: true, skipComments: true },
      ],
      "max-lines-per-function": [
        "error",
        { max: 200, skipBlankLines: true, skipComments: true },
      ],
      "max-statements": ["error", 40],
      "max-statements-per-line": ["error", { max: 1 }],
      "max-classes-per-file": ["error", 1],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "warn",
    },
  },
  {
    files: ["src/**/*.tsx"],
    rules: {
      "max-lines-per-function": [
        "error",
        { max: 400, skipBlankLines: true, skipComments: true },
      ],
    },
  },
];
