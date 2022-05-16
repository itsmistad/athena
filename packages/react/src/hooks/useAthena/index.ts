import { useCallback, useContext } from 'react';
import { AthenaContext, getInitialState, AthenaDispatcherActionKey, AthenaState } from '../../components';
import { AthenaComponents, AthenaComponentStyles, AthenaTheme, overrideWithPartialDeep } from '@athena-ui/base';
import { PartialDeep } from 'type-fest';
import { SetAthenaStylesModes } from './types';

export const useAthena = () => {
    const [state, dispatch] = useContext(AthenaContext);

    const configure = useCallback(
        (styles: PartialDeep<AthenaState['styles']>) => {
            const { styles: initialStyles, theme } = getInitialState();

            dispatch({
                type: AthenaDispatcherActionKey.SET_STATE,
                payload: {
                    styles: overrideWithPartialDeep<AthenaState['styles']>(initialStyles, styles),
                    theme: theme,
                },
            });
        },
        [dispatch],
    );

    const setTheme = useCallback(
        (theme: AthenaTheme) => {
            const { styles: stateStyles } = state;

            dispatch({
                type: AthenaDispatcherActionKey.SET_STATE,
                payload: {
                    styles: stateStyles,
                    theme,
                },
            });
        },
        [dispatch, state],
    );

    const setStyles = useCallback(
        <T extends AthenaComponents>({
            component,
            styles,
            theme,
            mode = SetAthenaStylesModes.ExtendDefaults,
        }: {
            component: T;
            styles: PartialDeep<typeof AthenaComponentStyles[T]>;
            theme?: AthenaTheme;
            mode?: SetAthenaStylesModes;
        }) => {
            const { styles: initialStyles } = getInitialState();
            const { styles: stateStyles } = state;

            const key = Object.keys(AthenaComponents).find((k) => AthenaComponents[k] === component);
            const initialComponentStyle = initialStyles[theme][key] as typeof AthenaComponentStyles[T];
            const stateComponentStyle = stateStyles[theme][key] as typeof AthenaComponentStyles[T];
            const shouldExtendDefaults = mode === SetAthenaStylesModes.ExtendDefaults;

            dispatch({
                type: AthenaDispatcherActionKey.SET_STATE,
                payload: {
                    styles: {
                        ...(shouldExtendDefaults ? initialStyles : stateStyles),
                        [theme ?? state.theme]: {
                            ...(shouldExtendDefaults ? initialStyles[theme] : stateStyles[theme]),
                            [component]:
                                mode === SetAthenaStylesModes.ExtendDefaults
                                    ? overrideWithPartialDeep<typeof AthenaComponentStyles[T]>(
                                          initialComponentStyle,
                                          styles,
                                      )
                                    : overrideWithPartialDeep<typeof AthenaComponentStyles[T]>(
                                          stateComponentStyle,
                                          styles,
                                      ),
                        },
                    },
                    theme,
                },
            });
            return;
        },
        [dispatch, state],
    );

    const getStyles = useCallback(
        (component: AthenaComponents) => {
            return state.styles[state.theme][component];
        },
        [state.styles, state.theme],
    );

    return {
        configure,
        setTheme,
        setStyles,
        getStyles,
    };
};
