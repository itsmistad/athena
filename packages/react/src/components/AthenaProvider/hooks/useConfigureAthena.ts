import { useContext } from 'react';
import { AthenaContext, getInitialState } from '..';
import { AthenaDispatcherActionKey, AthenaState } from '../types';
import { overrideWithPartialDeep } from '@athena-ui/base';
import { PartialDeep } from 'type-fest';

export const useConfigureAthena = ({
    styles,
    startWithDefaults,
}: {
    /**
        A deep-partial of styles for Athena's components.
    */
    styles: PartialDeep<AthenaState['styles']>;
    /**
        If true, Athena will update its state with the original configuration overriden by values defined in `styles`.
        
        If false, Athena will update its current state with values defined in `styles`.
    */
    startWithDefaults: boolean;
}) => {
    const [state, dispatch] = useContext(AthenaContext);
    dispatch({
        type: AthenaDispatcherActionKey.SET_STATE,
        payload: {
            styles: startWithDefaults
                ? overrideWithPartialDeep<AthenaState['styles']>(getInitialState().styles, styles)
                : overrideWithPartialDeep<AthenaState['styles']>(state.styles, styles),
        },
    });
};
