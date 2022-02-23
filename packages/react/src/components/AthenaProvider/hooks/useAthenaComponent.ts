import { AthenaComponent } from '@athena-ui/base';
import { useContext } from 'react';
import { AthenaContext } from '..';

export const useAthenaComponent = (component: AthenaComponent) => {
    const [state] = useContext(AthenaContext);

    return state.styles[component];
};
