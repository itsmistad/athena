import { AthenaComponents } from '@athena-ui/base';
import { useAthena, copyDefinedFields } from '@athena-ui/react';
import React from 'react';
import { Text as NativeText, TextProps, StyleSheet } from 'react-native';

export const Text = ({ children, ...rest }: TextProps) => {
    const { getStyles } = useAthena();
    const {
        color,
        fontSize,
        fontFamily,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
    } = getStyles(AthenaComponents.Text);
    return (
        <NativeText
            {...rest}
            style={{
                color,
                fontSize,
                fontFamily,
                marginTop,
                marginRight,
                marginBottom,
                marginLeft,
                paddingTop,
                paddingRight,
                paddingBottom,
                paddingLeft,
                ...copyDefinedFields(StyleSheet.flatten(rest.style)),
            }}
        >
            {children}
        </NativeText>
    );
};
