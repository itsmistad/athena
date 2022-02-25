export const sharedPackageVersionKey = 'NEXT_SHARED_PACKAGE_VERSION';

export enum VersionSecretsByDirectory {
    web = 'NEXT_WEB_APP_VERSION',
}

export class ArgError extends Error {
    message =
        'You must specify "packages" to update all module packages or "apps/<application directory name>" to update a specific application.';
}

export class NoGitHubEnvVarsError extends Error {
    message =
        'GitHub-specific env vars are missing. Typically, this means that you tried running this script outside of a GitHub Action!';
}

export class NoCommitNecessaryError extends Error {
    message = 'No commit is necessary.';
}

export interface ProcessEnvVersionSecrets {
    [sharedPackageVersionKey]: string;
    [VersionSecretsByDirectory.web]: string;
}

declare global {
    namespace NodeJS {
        interface ProcessEnv extends ProcessEnvVersionSecrets {
            GITHUB_ACTOR: string;
            GITHUB_TOKEN: string;
            GITHUB_REPOSITORY: string;
            GITHUB_REF_NAME: string;
        }
    }
}
