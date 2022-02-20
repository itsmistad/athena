module.exports = {
    root: true,
    env: {
        node: true
    },
    parserOptions: {
        ecmaVersion: 2020,
        ecmaFeatures: {
            legacyDecorators: true,
            jsx: true
        }
    },
    settings: {
        react: {
            version: '17'
        }
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
    },
    extends: [
        'standard',
        'standard-react',
        'plugin:prettier/recommended',
        'prettier/standard',
        'prettier/react',
        'plugin:@typescript-eslint/eslint-recommended'
    ],
};