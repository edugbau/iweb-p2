import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface ServerWakeContextType {
    is_waking_up: boolean;
    set_is_waking_up: (value: boolean) => void;
    retry_count: number;
    set_retry_count: (value: number) => void;
}

const ServerWakeContext = createContext<ServerWakeContextType | undefined>(undefined);

export const ServerWakeProvider = ({ children }: { children: ReactNode }) => {
    const [is_waking_up, set_is_waking_up] = useState(false);
    const [retry_count, set_retry_count] = useState(0);

    return (
        <ServerWakeContext.Provider value={{ is_waking_up, set_is_waking_up, retry_count, set_retry_count }}>
            {children}
        </ServerWakeContext.Provider>
    );
};

export const use_server_wake = () => {
    const context = useContext(ServerWakeContext);
    if (!context) {
        throw new Error('use_server_wake must be used within a ServerWakeProvider');
    }
    return context;
};
