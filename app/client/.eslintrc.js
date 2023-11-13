module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:import/recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react-hooks/recommended",
		"prettier",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: "./tsconfig.json",
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: ["react-refresh", "@typescript-eslint", "simple-import-sort"],
	rules: {
		"simple-import-sort/imports": "off",
		"simple-import-sort/exports": "error",
		"import/first": "error",
		"import/named": "off",
		"import/newline-after-import": "error",
		"import/no-duplicates": "error",
	},
};
