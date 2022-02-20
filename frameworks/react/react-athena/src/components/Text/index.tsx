import React, { PropsWithChildren } from 'react';

export const Text: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    return (
        <p>
            {children}
        </p>
    );
};