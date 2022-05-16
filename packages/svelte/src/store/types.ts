import type { AthenaComponents, AthenaComponentStyles, AthenaTheme } from '@athena-ui/base';
import type { Writable } from 'svelte/store';

export type WritableStyles = {
    [key in AthenaComponents]: Writable<typeof AthenaComponentStyles[key]>;
};

export type AthenaState = {
    theme: AthenaTheme;
    styles: {
        [theme in AthenaTheme]: typeof AthenaComponentStyles;
    };
};

export type AthenaStore = {
    styles: WritableStyles;
};

export enum SetAthenaStylesModes {
    ExtendDefaults,
    ExtendState,
}
