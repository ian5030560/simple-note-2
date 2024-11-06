import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import lexicalEslintPlugin from "@lexical/eslint-plugin";

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    "settings": {
      "react": {
        "version": "detect"
      }
    }
  },
  {
    plugins: { 'react-hooks': pluginReactHooks },
    rules: pluginReactHooks.configs.recommended.rules,
  },
  {
    plugins: { '@lexical': lexicalEslintPlugin },
    rules: lexicalEslintPlugin.configs.all.rules,
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-require-imports": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-key": "off",
      "react/display-name": "off",
      "prefer-const": "off",
      "react/no-is-mounted": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "react/prop-types": "off",
      "no-inline-styles": "off",
      "@typescript-eslint/ban-ts-comment": "off"
    }
  }
];