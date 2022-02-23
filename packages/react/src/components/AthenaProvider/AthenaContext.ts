import { AthenaComponent, AthenaComponentStyle } from '@athena-ui/base';
import React from 'react';
import { AthenaState, AthenaDispatcherAction } from './types';

export const getInitialState = (): AthenaState =>
    Object.keys(AthenaComponent).reduce(
        (accumulator, component) => ({
            ...accumulator,
            styles: {
                ...accumulator.styles,
                [component]: AthenaComponentStyle[component],
            },
        }),
        {} as AthenaState,
    );

export const AthenaContext = React.createContext<
    [AthenaState, React.Dispatch<AthenaDispatcherAction>]
>([getInitialState(), () => {}]);
