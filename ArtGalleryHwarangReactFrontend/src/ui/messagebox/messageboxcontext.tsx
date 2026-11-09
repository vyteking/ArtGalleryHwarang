import { createContext, useCallback, useState, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';

export type MessageboxType = 'info' | 'warning' | 'error' | 'success';
export type MessageboxMode = 'alert' | 'confirm';

interface MessageboxState {
    isOpen: boolean;
    message: string;
    type: MessageboxType | '';
    mode: MessageboxMode;
    onConfirm?: () => void;
    onCancel?: () => void;
}

interface MessageboxContextValue {
    messagebox: MessageboxState;
    showMessage: (message: string, type?: MessageboxType) => void;
    hideMessage: () => void;
    showConfirm: (message: string, type?: MessageboxType) => Promise<boolean>;
}

const MessageboxContext = createContext<MessageboxContextValue | null>(null);

export const MessageboxProvider = ({ children }: { children: ReactNode }) => {
    const [messagebox, setMessagebox] = useState<MessageboxState>({
        isOpen: false,
        message: '',
        type: '',
        mode: 'alert',
    });

    const showMessage = useCallback((message: string, type: MessageboxType = 'info') => {
        setMessagebox({ isOpen: true, message, type, mode: 'alert' });
    }, []);

    const hideMessage = useCallback(() => {
        setMessagebox(prev => ({ ...prev, isOpen: false }));
    }, []);

    const showConfirm = useCallback((message: string, type: MessageboxType = 'warning'): Promise<boolean> => {
        return new Promise((resolve) => {
            setMessagebox({
                isOpen: true,
                message,
                type,
                mode: 'confirm',
                onConfirm: () => {
                    setMessagebox(prev => ({ ...prev, isOpen: false }));
                    resolve(true);
                },
                onCancel: () => {
                    setMessagebox(prev => ({ ...prev, isOpen: false }));
                    resolve(false);
                },
            });
        });
    }, []);

    const value = useMemo(
        () => ({ messagebox, showMessage, hideMessage, showConfirm }),
        [messagebox, showMessage, hideMessage, showConfirm],
    );

    return (
        <MessageboxContext.Provider value={value}>
            {children}
        </MessageboxContext.Provider>
    );
};

export const useMessagebox = (): MessageboxContextValue => {
    const ctx = useContext(MessageboxContext);
    if (!ctx) throw new Error('useMessagebox must be used within a MessageboxProvider');
    return ctx;
};
