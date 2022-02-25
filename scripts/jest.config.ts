import type { Config } from '@jest/types';
import defaultConfig from '../jest.config';

const config: Config.InitialOptions = {
    ...defaultConfig,
    rootDir: '.',
    projects: undefined,
};
export default config;
