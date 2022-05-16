import { AthenaComponentStyles, AthenaComponents } from '@athena-ui/base';
import type { ComponentStyles } from '../components/types';

export const convertStyleToString = (styles: ComponentStyles) => {
    return Object.keys(styles).reduce(
        (acc, style) => `
            ${acc}
            ${style}: ${styles[style]};
        `,
        '',
    );
};
