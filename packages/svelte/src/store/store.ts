import { AthenaComponents, AthenaComponentStyles, AthenaThemes } from '@athena-ui/base';
import type { AthenaState, AthenaStore, WritableStyles } from './types';
import { writable } from 'svelte/store';

export const getInitialState = (): AthenaState =>
    Object.keys(AthenaThemes).reduce(
        (accumulator, theme) => ({
            ...accumulator,
            styles: {
                ...accumulator.styles,
                [theme]: {
                    ...AthenaComponentStyles,
                },
            },
        }),
        {} as AthenaState,
    );

export const currentState = getInitialState();

export const store: AthenaStore = {
    styles: Object.keys(AthenaComponents).reduce(
        (components, component) => ({
            ...components,
            [component]: writable(AthenaComponentStyles[component]),
        }),
        {} as WritableStyles,
    ),
};
