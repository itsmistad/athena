const state = {
    readFileReturn: {
        version: '1.0.0',
        peerDependencies: {
            '@athena-ui/base': '^1.0.0',
        },
    },
    readdirReturn: ['react'],
    toolkitRunCommits: [
        {
            message: 'hello world',
            body: 'test!',
        },
    ],
};

global.console = {
    ...global.console,
    log: jest.fn(),
    error: jest.fn(),
};

jest.mock('fs', () => ({
    existsSync: jest.fn(() => true),
}));

jest.mock('fs/promises', () => ({
    readFile: jest.fn(async () => Buffer.from(JSON.stringify(state.readFileReturn))),
    writeFile: jest.fn(() => {}),
    readdir: jest.fn(() => state.readdirReturn),
    stat: jest.fn(async () => ({
        isDirectory: jest.fn(() => true),
        isFile: jest.fn(() => true),
    })),
}));

jest.mock('tweetsodium', () => ({
    seal: jest.fn(() => new Uint8Array([])),
}));

jest.mock('axios', () => ({
    get: jest.fn(async () => ({
        data: {
            key: 'publicKey',
        },
    })),
    put: jest.fn(() => {}),
}));

const toolkitTools = {
    context: {
        payload: {
            commits: state.toolkitRunCommits,
        },
    },
    exec: jest.fn(async (command: string, args: string[]) => {}),
};

jest.mock('actions-toolkit', () => ({
    Toolkit: {
        run: jest.fn((callback: (tools: any) => {}) => {
            callback(toolkitTools);
        }),
    },
}));

import { ArgError, NoGitHubEnvVarsError, updateVersions } from '../src';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import sodium from 'tweetsodium';
import axios from 'axios';
import { PackageJson } from 'type-fest';
import { SemVer } from 'semver';
import { Toolkit } from 'actions-toolkit';

describe('updateVersions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env = {
            ...process.env,
            GITHUB_ACTOR: 'itsmistad',
            GITHUB_REF_NAME: 'main',
            GITHUB_REPOSITORY: 'itsmistad/athena',
            GITHUB_TOKEN: 'GITHUB_TOKEN',
        };
    });
    it('throws if target is invalid', async () => {
        try {
            await updateVersions('invalid!');
        } catch (ex) {
            expect(ex).toBeInstanceOf(ArgError);
        }
    });
    it('throws if env vars are missing', async () => {
        process.env = {
            ...process.env,
            GITHUB_ACTOR: undefined,
            GITHUB_REF_NAME: undefined,
            GITHUB_REPOSITORY: undefined,
            GITHUB_TOKEN: undefined,
        };
        try {
            await updateVersions('packages');
        } catch (ex) {
            expect(ex).toBeInstanceOf(NoGitHubEnvVarsError);
        }
    });
    it('updates package versions, pushes a commit, and updates appropriate the secret value', async () => {
        process.env = {
            ...process.env,
            NEXT_SHARED_PACKAGE_VERSION: '1.0.1',
        };
        await updateVersions('packages');
        expect(fsp.readdir).toHaveBeenCalledWith(path.join('..', 'packages'));
        expect(fsp.stat).toHaveBeenNthCalledWith(1, path.join('..', 'packages', 'react'));
        expect(fs.existsSync).toHaveBeenCalledWith(path.join('..', 'packages', 'react', 'package.json'));
        expect(fsp.stat).toHaveBeenNthCalledWith(2, path.join('..', 'packages', 'react', 'package.json'));
        expect(fsp.readFile).toHaveBeenNthCalledWith(1, path.join('..', 'packages', 'react', 'package.json'));
        expect(fsp.writeFile).toHaveBeenCalledWith(
            path.join('..', 'packages', 'react', 'package.json'),
            JSON.stringify(
                {
                    version: process.env.NEXT_SHARED_PACKAGE_VERSION,
                    peerDependencies: {
                        '@athena-ui/base': `^${process.env.NEXT_SHARED_PACKAGE_VERSION}`,
                    },
                },
                null,
                4,
            ) + '\n',
        );
        expect(toolkitTools.exec).toHaveBeenNthCalledWith(
            1,
            'git',
            expect.arrayContaining([
                'commit',
                '-a',
                '-m',
                `chore: version bumped to v${process.env.NEXT_SHARED_PACKAGE_VERSION}`,
            ]),
        );
        expect(toolkitTools.exec).toHaveBeenNthCalledWith(
            2,
            'git',
            expect.arrayContaining(['checkout', process.env.GITHUB_REF_NAME]),
        );
        expect(toolkitTools.exec).toHaveBeenNthCalledWith(
            3,
            'git',
            expect.arrayContaining([
                'push',
                `https://${process.env.GITHUB_ACTOR}:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`,
                process.env.GITHUB_REF_NAME,
            ]),
        );
        expect(axios.get).toHaveBeenCalledWith(
            `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/actions/secrets/public-key`,
            expect.objectContaining({
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }),
        );
        expect(axios.put).toHaveBeenCalledWith(
            `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/actions/secrets/NEXT_SHARED_PACKAGE_VERSION`,
            expect.objectContaining({
                encrypted_value: '',
            }),
            expect.objectContaining({
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }),
        );
    });
    it('updates app versions, pushes a commit, and updates appropriate the secret value', async () => {
        process.env = {
            ...process.env,
            NEXT_WEB_APP_VERSION: '1.0.1',
        };
        const target = 'web';
        state.readdirReturn = [target];
        await updateVersions(target);
        expect(fsp.stat).toHaveBeenNthCalledWith(1, path.join('..', 'apps', target));
        expect(fs.existsSync).toHaveBeenCalledWith(path.join('..', 'apps', target, 'package.json'));
        expect(fsp.stat).toHaveBeenNthCalledWith(2, path.join('..', 'apps', target, 'package.json'));
        expect(fsp.readFile).toHaveBeenNthCalledWith(1, path.join('..', 'apps', target, 'package.json'));
        expect(fsp.readFile).toHaveBeenNthCalledWith(2, path.join('..', 'packages', 'base', 'package.json'));
        expect(fsp.writeFile).toHaveBeenCalledWith(
            path.join('..', 'apps', target, 'package.json'),
            JSON.stringify(
                {
                    version: process.env.NEXT_WEB_APP_VERSION,
                    peerDependencies: {
                        '@athena-ui/base': `^1.0.0`,
                    },
                },
                null,
                4,
            ) + '\n',
        );
        expect(toolkitTools.exec).toHaveBeenNthCalledWith(
            1,
            'git',
            expect.arrayContaining([
                'commit',
                '-a',
                '-m',
                `chore: version bumped to v${process.env.NEXT_SHARED_PACKAGE_VERSION}`,
            ]),
        );
        expect(toolkitTools.exec).toHaveBeenNthCalledWith(
            2,
            'git',
            expect.arrayContaining(['checkout', process.env.GITHUB_REF_NAME]),
        );
        expect(toolkitTools.exec).toHaveBeenNthCalledWith(
            3,
            'git',
            expect.arrayContaining([
                'push',
                `https://${process.env.GITHUB_ACTOR}:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`,
                process.env.GITHUB_REF_NAME,
            ]),
        );
        expect(axios.get).toHaveBeenCalledWith(
            `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/actions/secrets/public-key`,
            expect.objectContaining({
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }),
        );
        expect(axios.put).toHaveBeenCalledWith(
            `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/actions/secrets/NEXT_WEB_APP_VERSION`,
            expect.objectContaining({
                encrypted_value: '',
            }),
            expect.objectContaining({
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }),
        );
    });
});
