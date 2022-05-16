import { AthenaComponents } from '@athena-ui/base';
import { useAthena } from '../../hooks';
import React from 'react';
import { copyDefinedFields } from '../../util';

type TextProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;

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
        <p
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
                ...copyDefinedFields(rest.style),
            }}
        >
            {children}
        </p>
    );
};
