import { AthenaComponentStyle } from '@athena-ui/base';

export type AthenaState = {
    styles: typeof AthenaComponentStyle;
};

export enum AthenaDispatcherActionKey {
    SET_STATE = 'SET_ATHENA_STATE',
}

export type AthenaDispatcherAction = {
    type: typeof AthenaDispatcherActionKey.SET_STATE;
    payload: AthenaState;
};
