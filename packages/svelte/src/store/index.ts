import { AthenaComponents, AthenaComponentStyles, overrideWithPartialDeep, type AthenaTheme } from '@athena-ui/base';
import { SetAthenaStylesModes, type AthenaState } from './types';
import type { PartialDeep } from 'type-fest';
import { currentState, getInitialState, store } from './store';
import type { Writable } from 'svelte/store';

export * from './store';
export * from './types';

export const getStyles = (component: AthenaComponents) => {
    return currentState.styles[currentState.theme][component];
};

export const setStyles = <T extends AthenaComponents>({
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
    const { styles: stateStyles } = currentState;
    const { styles: styleStores } = store;

    const key = Object.keys(AthenaComponents).find((k) => AthenaComponents[k] === component);
    const initialComponentStyle = initialStyles[theme ?? currentState.theme][key] as typeof AthenaComponentStyles[T];
    const stateComponentStyle = stateStyles[theme ?? currentState.theme][key] as typeof AthenaComponentStyles[T];
    const componentStyleStore = styleStores[key] as Writable<typeof AthenaComponentStyles[T]>;
    const shouldExtendDefaults = mode === SetAthenaStylesModes.ExtendDefaults;

    const newComponentStyle = shouldExtendDefaults
        ? overrideWithPartialDeep<typeof AthenaComponentStyles[T]>(initialComponentStyle, styles)
        : overrideWithPartialDeep<typeof AthenaComponentStyles[T]>(stateComponentStyle, styles);

    currentState.styles[theme ?? currentState.theme][key] = newComponentStyle;
    if (!theme || theme === currentState.theme) {
        componentStyleStore.set(newComponentStyle);
    }
};

export const setTheme = (theme: AthenaTheme) => {
    const { styles: stateStyles } = currentState;
    const { styles: styleStores } = store;

    currentState.theme = theme;
    for (const key in styleStores) {
        const styleStoreKey = key as keyof typeof styleStores;
        const stateComponentStyle = stateStyles[theme][key] as typeof AthenaComponentStyles[typeof styleStoreKey];
        const componentStyleStore = styleStores[key] as Writable<typeof AthenaComponentStyles[typeof styleStoreKey]>;

        componentStyleStore.set(stateComponentStyle);
    }
};

export const configure = (styles: AthenaState['styles']) => {
    const { styles: initialStyles } = getInitialState();
    const { theme } = currentState;
    const { styles: styleStores } = store;

    currentState.styles = {
        ...(styles as AthenaState['styles']),
    };
    for (const key in styleStores) {
        const styleStoreKey = key as keyof typeof styleStores;
        const componentStyleStore = styleStores[styleStoreKey] as Writable<
            typeof AthenaComponentStyles[typeof styleStoreKey]
        >;

        const initialStyleTheme = initialStyles[theme];
        const initialComponentStyleKey = key as keyof typeof initialStyleTheme;
        const initialComponentStyle = initialStyleTheme[initialComponentStyleKey];

        const newStyleTheme = styles[theme];
        const newComponentStyleKey = key as keyof typeof newStyleTheme;
        const newComponentStyle = newStyleTheme[newComponentStyleKey] as PartialDeep<
            typeof AthenaComponentStyles[typeof newComponentStyleKey]
        >;

        componentStyleStore.set(
            overrideWithPartialDeep<typeof AthenaComponentStyles>(initialComponentStyle, newComponentStyle),
        );
    }
};

export const subscribe = (component: AthenaComponents) => {
    const componentStyleStore = store.styles[component as keyof typeof store.styles];
    let style: typeof AthenaComponentStyles[typeof component];
    const unsubscribe = componentStyleStore.subscribe((_style) => {
        style = _style;
    });
    return { style, unsubscribe };
};
