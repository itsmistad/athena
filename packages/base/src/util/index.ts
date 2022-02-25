import { PartialDeep } from 'type-fest';

export * from './fonts';
export * from './types';

export const overrideWithPartialDeep = <T>(baseObj: T, partialObj: PartialDeep<T>) => {
    const newObj = {
        ...baseObj,
    };
    for (const partialKey in partialObj) {
        const key = partialKey as string;
        const value = partialObj[key] as PartialDeep<T[keyof T]>;
        if (value != null && typeof value === typeof newObj[key]) {
            if (typeof value === 'object') {
                newObj[key] = overrideWithPartialDeep(baseObj[key as string] as T[keyof T], value);
            } else {
                newObj[key] = value as T[keyof T];
            }
        }
    }
    return newObj;
};
