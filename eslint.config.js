import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "app", ".astro", ".workbuddy-ai", "scripts", ".chrome-profile", "audit"] },
  { extends: [js.configs.recommended, ...tseslint.configs.recommended], files: ["**/*.{ts,js,mjs}"] },
  { languageOptions: { globals: globals.browser } },
);
