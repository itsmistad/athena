export const copyDefinedFields = (input?: object) => {
    if (!input) {
        return undefined;
    }

    const result = {};
    for (const key in input) {
        const value = input[key];
        if (value !== undefined) {
            result[key] = value;
        }
    }

    return result;
};
