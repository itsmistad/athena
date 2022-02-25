import { updateVersions } from './updateVersions';
export * from './updateVersions';
export * from './types';

const scripts = {
    updateVersions,
};

(async () => {
    const [, , script, ...args] = process.argv;
    if (script in scripts) {
        console.log(`Running target: ${script}`);
        await scripts[script](...args);
    }
})();
