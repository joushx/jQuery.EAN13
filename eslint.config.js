const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const js = require("@eslint/js");

module.exports = [
    js.configs.recommended,
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "no-undef": "off", // TypeScript handles this
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
        },
    },
    {
        ignores: ["dist/", "node_modules/", "*.js"]
    }
];
