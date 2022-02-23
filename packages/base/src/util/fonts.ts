import WebFont from 'webfontloader';
import { FontFamily } from './types';

export const loadWebFonts = (families: Array<FontFamily>) => {
    WebFont.load({
        google: {
            families: families.reduce(
                (accumulator, family) => [
                    ...accumulator,
                    `${family.name}:${family.weights.join(',')}`,
                ],
                [] as string[],
            ),
        },
    });
};

loadWebFonts([
    {
        name: 'Montserrat',
        weights: [300, 500, 700],
    },
    {
        name: 'Lato',
        weights: [300, 500, 700],
    },
]);
