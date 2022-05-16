module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['../../.eslintrc.js'],
    plugins: ['svelte3', '@typescript-eslint'],
    overrides: [
        {
            files: ['*.svelte'],
            processor: 'svelte3/svelte3',
        },
    ],
    settings: {
        'svelte3/typescript': () => require('typescript'),
    },
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020,
    },
    env: {
        browser: true,
        es2017: true,
        node: true,
    },
};
