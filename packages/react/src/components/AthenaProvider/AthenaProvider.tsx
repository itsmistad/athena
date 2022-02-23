import React, { useReducer } from 'react';
import { AthenaContext, getInitialState } from '.';
import {
    AthenaDispatcherAction,
    AthenaDispatcherActionKey,
    AthenaState,
} from './types';

const reducer = (
    state: AthenaState,
    action: AthenaDispatcherAction,
): AthenaState => {
    switch (action.type) {
        case AthenaDispatcherActionKey.SET_STATE:
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};

export const AthenaProvider: React.FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, getInitialState());

    return (
        <AthenaContext.Provider value={[state, dispatch]}>
            {children}
        </AthenaContext.Provider>
    );
};
