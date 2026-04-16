import React, { createContext, useContext, useState, useEffect } from 'react';
import { GetCurrentLoginSession, GetLoginUsers, UserLogin, UserLogout, SwitchLoginSession } from './session';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
    const [accounts, setAccounts] = useState(GetLoginUsers());
    const [currentUser, setCurrentUser] = useState(GetCurrentLoginSession());

    const refreshState = () => {
        setAccounts(GetLoginUsers());
        setCurrentUser(GetCurrentLoginSession());
    };

    const login = (userData) => {
        UserLogin(userData);
        refreshState();
    };

    const logout = (user) => {
        UserLogout(user || currentUser);
        refreshState();
    };

    const switchAccount = (user) => {
        SwitchLoginSession(user);
        refreshState();
    };

    // Sync state when localStorage changes in another tab
    useEffect(() => {
        window.addEventListener('storage', refreshState);
        return () => window.removeEventListener('storage', refreshState);
    }, []);

    return (
        <SessionContext.Provider value={{ currentUser, accounts, login, logout, switchAccount }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}
