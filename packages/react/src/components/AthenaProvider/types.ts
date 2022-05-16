import { AthenaComponents, AthenaComponentStyles, AthenaTheme } from '@athena-ui/base';

export type AthenaState = {
    styles: {
        [key in AthenaTheme]: typeof AthenaComponentStyles;
    };
    theme: AthenaTheme;
};

export enum AthenaDispatcherActionKey {
    SET_STATE = 'SET_ATHENA_STATE',
}

export type AthenaDispatcherAction = {
    type: typeof AthenaDispatcherActionKey.SET_STATE;
    payload: AthenaState;
};
