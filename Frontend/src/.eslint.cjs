module.exports = {
    root: true,
    env: { browser: true, es2022: true, node: true },
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "react", "react-hooks", "prettier"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:prettier/recommended",
    ],
    settings: { react: { version: "detect" } },
    rules: {
        "prettier/prettier": "error",
    },
};
