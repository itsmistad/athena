import { AthenaComponent } from '@athena-ui/base';
import { useAthenaComponent } from '..';
import React from 'react';

export const Text: React.FC<{
    style?: React.CSSProperties;
}> = ({ children, style }) => {
    const component = useAthenaComponent(AthenaComponent.Text);
    return (
        <p
            style={{
                color: style?.color || component.color,
                fontSize: style?.fontSize || component.fontSize,
                fontFamily: style?.fontFamily || component.fontFamily,
            }}
        >
            {children}
        </p>
    );
};
