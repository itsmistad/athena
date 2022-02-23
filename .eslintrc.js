module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:prettier/recommended',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'],
    overrides: [
        {
            files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
            rules: {
                '@typescript-eslint/no-shadow': ['error'],
                'no-shadow': 'off',
                'no-undef': 'off',
                'no-unused-vars': 'off',
                'prettier/prettier': 'error',
            },
        },
    ],
};
