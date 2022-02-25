import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import sodium from 'tweetsodium';
import axios from 'axios';
import { PackageJson } from 'type-fest';
import { SemVer } from 'semver';
import { Toolkit } from 'actions-toolkit';
import {
    ProcessEnvVersionSecrets,
    NoCommitNecessaryError,
    sharedPackageVersionKey,
    VersionSecretsByDirectory,
    NoGitHubEnvVarsError,
    ArgError,
} from './types';

const encryptSecret = (base64PublicKey: string, secretValue: string) => {
    const secretValueBytes = Buffer.from(secretValue);
    const publicKeyBytes = Buffer.from(base64PublicKey, 'base64');
    return Buffer.from(sodium.seal(secretValueBytes, publicKeyBytes)).toString('base64');
};

const getVersionSecret = (secretName: keyof ProcessEnvVersionSecrets) => {
    return new SemVer(process.env[secretName]);
};

const updateVersionSecretInGitHub = async (secretName: keyof ProcessEnvVersionSecrets) => {
    const semanticVersion = getVersionSecret(secretName);
    console.log('Current version secret value:', semanticVersion.version);
    semanticVersion.inc('patch');
    console.log('New version secret value:', semanticVersion.version);
    const publicKey = (
        await axios.get<{
            key: string;
        }>(`https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/actions/secrets/public-key`, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json',
            },
        })
    ).data.key;
    const newSecretValue = encryptSecret(publicKey, semanticVersion.version);
    await axios.put(
        `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/actions/secrets/${secretName}`,
        {
            encrypted_value: newSecretValue,
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json',
            },
        },
    );
    console.log('Updated secret value!');
};

const readPackageJsonFile = async (filePath: string) => {
    const content = (await fsp.readFile(filePath)).toString('utf8').replace(/^\uFEFF/, '');
    return JSON.parse(content) as PackageJson;
};

const writePackageJsonFile = async (packageJson: PackageJson, filePath: string) => {
    const content = JSON.stringify(packageJson, null, 4);
    await fsp.writeFile(filePath, content + '\n');
};

const commitVersionBumpAndPush = async (commitMessage: string, version: string) => {
    await Toolkit.run(async (tools) => {
        const event = tools.context.payload;
        const messages: string[] = event.commits.map(
            (commit: { message: string; body: string }) => commit.message + '\n' + commit.body,
        );
        const isVersionBump = messages.map((message) => message.toLowerCase().includes(commitMessage)).includes(true);
        if (isVersionBump) {
            throw new NoCommitNecessaryError();
        }
        await tools.exec('git', ['commit', '-a', '-m', `chore: ${commitMessage}${version}`]);
        await tools.exec('git', ['checkout', process.env.GITHUB_REF_NAME]);
        const remoteRepo = `https://${process.env.GITHUB_ACTOR}:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`;
        await tools.exec('git', ['push', remoteRepo, process.env.GITHUB_REF_NAME]);
        console.log('Commit pushed!');
    });
};

const updatePackageVersions = async () => {
    console.log('Searching for package.json files in "../packages"...');
    const packageDirs = (await fsp.readdir(path.join('..', 'packages'))).filter(async (file) =>
        (await fsp.stat(path.join('..', 'packages', file))).isDirectory(),
    );
    const packageJsonFilePaths = await packageDirs.reduce(async (accumulator, packageDir) => {
        const jsonFilePath = path.join('..', 'packages', packageDir, 'package.json');
        if ((await fs.existsSync(jsonFilePath)) && (await fsp.stat(jsonFilePath)).isFile()) {
            return [...(await accumulator), jsonFilePath];
        }
        return [...(await accumulator)];
    }, Promise.resolve([] as string[]));
    const { version } = getVersionSecret(sharedPackageVersionKey);
    for (const filePath of packageJsonFilePaths) {
        console.log('Found file:', filePath);
        const packageJson = await readPackageJsonFile(filePath);
        packageJson.version = version;
        for (const dep in packageJson.peerDependencies) {
            packageJson.peerDependencies[dep] = `^${version}`;
        }
        await writePackageJsonFile(packageJson, filePath);
        console.log('Updated!');
    }
    await commitVersionBumpAndPush('version bumped to v', version);
    await updateVersionSecretInGitHub(sharedPackageVersionKey);
};

const updateAppVersion = async (appDir: string) => {
    console.log('Searching for package.json files in "../apps"...');
    const jsonFilePath = path.join('..', 'apps', appDir, 'package.json');
    if (!(await fs.existsSync(jsonFilePath)) || !(await fsp.stat(jsonFilePath)).isFile()) {
        return;
    }
    console.log('Found file:', jsonFilePath);
    const packageJson = await readPackageJsonFile(jsonFilePath);
    const appVersionSecretName = VersionSecretsByDirectory[appDir] as keyof ProcessEnvVersionSecrets;
    const { version: appVersion } = getVersionSecret(appVersionSecretName);
    packageJson.version = appVersion;
    for (const dep in packageJson.peerDependencies) {
        const packageName = dep.replace('@athena-ui/', '');
        const packageJsonFilePath = path.join('..', 'packages', packageName, 'package.json');
        console.log('Found file:', packageJsonFilePath);
        const { version: depVersion } = await readPackageJsonFile(packageJsonFilePath);
        packageJson.peerDependencies[dep] = `^${depVersion}`;
    }
    await writePackageJsonFile(packageJson, jsonFilePath);
    console.log('Updated!');
    await commitVersionBumpAndPush('version bumped to v', appVersion);
    await updateVersionSecretInGitHub(appVersionSecretName);
};

export const updateVersions = async (target: string) => {
    try {
        if (
            !process.env.GITHUB_TOKEN ||
            !process.env.GITHUB_ACTOR ||
            !process.env.GITHUB_REF_NAME ||
            !process.env.GITHUB_REPOSITORY
        ) {
            throw new NoGitHubEnvVarsError();
        }
        if (target === 'packages') {
            await updatePackageVersions();
        } else if (
            target in VersionSecretsByDirectory &&
            (await fsp.stat(path.join('..', 'apps', target))).isDirectory()
        ) {
            await updateAppVersion(target);
        } else {
            throw new ArgError();
        }
        console.log('Done!');
    } catch (ex) {
        console.error(ex);
        if (!(ex instanceof NoCommitNecessaryError)) {
            throw ex;
        }
    }
};
