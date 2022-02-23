module.exports = {
    extends: [
        '../../.eslintrc.js',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
    ],
    plugins: ['react', 'react-hooks'],
    rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
    },
};
