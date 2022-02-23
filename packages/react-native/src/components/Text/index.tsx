import React from 'react';
import { Text as BaseText, TextProps, StyleSheet } from 'react-native';
import { useAthenaComponent } from '@athena-ui/react';
import { AthenaComponent } from '@athena-ui/base';

export const Text: React.FC<{
    style?: TextProps['style'];
}> = ({ children, style }) => {
    const flattenedStyle = StyleSheet.flatten(style);
    const component = useAthenaComponent(AthenaComponent.Text);
    return (
        <BaseText
            style={{
                color: flattenedStyle?.color || component.color,
                fontSize: flattenedStyle?.fontSize || component.fontSize,
                fontFamily: flattenedStyle?.fontFamily || component.fontFamily,
            }}
        >
            {children}
        </BaseText>
    );
};
