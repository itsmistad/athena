import React, { PropsWithChildren } from 'react';
import { Text as _Text } from 'react-native';

export const Text: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    return (
        <_Text>
            {children}
        </_Text>
    );
};