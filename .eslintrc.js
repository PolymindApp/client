module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: [
		'plugin:vue/essential',
		'eslint:recommended'
	],
	rules: {
		"editorconfig/editorconfig": "error",
		"no-unused-vars": ['error', { "args": "none" }],
		"no-tabs": 0,
		"indent": 0,
		"no-console": "off"
	},
	plugins: [ "editorconfig" ],
	parserOptions: {
		parser: 'babel-eslint'
	}
};

