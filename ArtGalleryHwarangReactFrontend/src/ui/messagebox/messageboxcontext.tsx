import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

export type MessageboxType = 'info' | 'warning' | 'error' | 'success';

interface MessageboxState {
    isOpen: boolean;
    message: string;
    type: MessageboxType | '';
}

interface MessageboxContextValue {
    messagebox: MessageboxState;
    showMessage: (message: string, type?: MessageboxType) => void;
    hideMessage: () => void;
}

const MessageboxContext = createContext<MessageboxContextValue | null>(null);

export const MessageboxProvider = ({ children }: { children: ReactNode }) => {
    const [messagebox, setMessagebox] = useState<MessageboxState>({
        isOpen: false,
        message: '',
        type: ''
    });

    const showMessage = (message: string, type: MessageboxType = 'info') => {
        setMessagebox({ isOpen: true, message, type });
    };

    const hideMessage = () => {
        setMessagebox({ isOpen: false, message: '', type: '' });
    };

    return (
        <MessageboxContext.Provider value={{ messagebox, showMessage, hideMessage }}>
            {children}
        </MessageboxContext.Provider>
    );
};

export const useMessagebox = (): MessageboxContextValue => {
    const ctx = useContext(MessageboxContext);
    if (!ctx) throw new Error('useMessagebox must be used within a MessageboxProvider');
    return ctx;
};
