import React, { createContext, useState, useContext } from 'react';

const MessageboxContext = createContext();

export const MessageboxProvider = ({ children }) => {
    const [messagebox, setMessagebox] = useState({
        isOpen: false,
        message: '',
        type: ''
    });

    const showMessage = (message, type = 'info') => {
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

export const useMessagebox = () => useContext(MessageboxContext);