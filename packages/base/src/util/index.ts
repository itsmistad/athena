import { PartialDeep } from 'type-fest';

export * from './types';

export const overrideWithPartialDeep = <ObjectType>(baseObj: ObjectType, partialObj: PartialDeep<ObjectType>) => {
    const newObj = {
        ...baseObj,
    };
    for (const partialKey in partialObj) {
        const key = partialKey as string;
        const value = partialObj[key] as PartialDeep<ObjectType[keyof ObjectType]>;
        if (value != null && typeof value === typeof newObj[key]) {
            if (typeof value === 'object') {
                newObj[key] = overrideWithPartialDeep(baseObj[key as string] as ObjectType[keyof ObjectType], value);
            } else {
                newObj[key] = value as ObjectType[keyof ObjectType];
            }
        }
    }
    return newObj;
};
