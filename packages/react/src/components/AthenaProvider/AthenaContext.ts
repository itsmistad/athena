import { AthenaComponents, AthenaComponentStyles, AthenaThemes } from '@athena-ui/base';
import React from 'react';
import { AthenaState, AthenaDispatcherAction } from './types';

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

export const AthenaContext = React.createContext<[AthenaState, React.Dispatch<AthenaDispatcherAction>]>([
    getInitialState(),
    () => {},
]);
