export type FontFamily = {
    name: string;
    weights: Array<number>;
};

export type Partial<T> = T extends Function
    ? T
    : T extends object
    ? { [P in keyof T]?: T[P] }
    : T;

export type DeepPartial<T> = T extends Function
    ? T
    : T extends object
    ? { [P in keyof T]?: DeepPartial<T[P]> }
    : T;
