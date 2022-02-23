import { DeepPartial } from './types';

export * from './fonts';
export * from './types';

export const overrideWithDeepPartial = <T>(
    baseObj: T,
    partialObj: DeepPartial<T>,
) => {
    const newObj = {
        ...baseObj,
    };
    for (const partialKey in partialObj) {
        const key = partialKey as string;
        const value = partialObj[key] as DeepPartial<T[keyof T]>;
        if (value != null && typeof value === typeof newObj[key]) {
            if (typeof value === 'object') {
                newObj[key] = overrideWithDeepPartial(
                    baseObj[key as string] as T[keyof T],
                    value,
                );
            } else {
                newObj[key] = value as T[keyof T];
            }
        }
    }
    return newObj;
};
