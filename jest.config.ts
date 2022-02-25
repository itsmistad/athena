import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testTimeout: 120000,
    testPathIgnorePatterns: ['dist', 'node_modules'],
    rootDir: '.',
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.json',
        },
    },
    projects: ['scripts'],
};
export default config;
