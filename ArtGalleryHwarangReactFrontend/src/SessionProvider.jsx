import React, { createContext, useContext, useState, useEffect } from 'react';
import { GetCurrentLoginSession, UserLogin, UserLogout } from './authsession';

// 1. Create the context
const SessionContext = createContext(null);

// 2. Create the Provider component
export function SessionProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(GetCurrentLoginSession());

    // Function to wrap the original UserLogin and update the state
    const login = (userData) => {
        UserLogin(userData);
        setCurrentUser(GetCurrentLoginSession());
    };

    // Function to wrap the original UserLogout and update the state
    const logout = (user) => {
        UserLogout(user);
        setCurrentUser(null); // Set to null immediately
    };

    // This effect listens for changes in localStorage that might happen in other tabs
    useEffect(() => {
        const handleStorageChange = () => {
            setCurrentUser(GetCurrentLoginSession());
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const value = {
        currentUser,
        login,
        logout
    };

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
}

// 3. Create a custom hook for easy access to the context
export function useSession() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}
