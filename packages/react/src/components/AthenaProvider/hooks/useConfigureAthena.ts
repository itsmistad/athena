import { useContext } from 'react';
import { AthenaContext, getInitialState } from '..';
import { AthenaDispatcherActionKey, AthenaState } from '../types';
import { DeepPartial, overrideWithDeepPartial } from '@athena-ui/base';

export const useConfigureAthena = ({
    styles,
    startWithDefaults,
}: {
    /**
        A deep-partial of styles for Athena's components.
    */
    styles: DeepPartial<AthenaState['styles']>;
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
                ? overrideWithDeepPartial<AthenaState['styles']>(
                      getInitialState().styles,
                      styles,
                  )
                : overrideWithDeepPartial<AthenaState['styles']>(
                      state.styles,
                      styles,
                  ),
        },
    });
};
