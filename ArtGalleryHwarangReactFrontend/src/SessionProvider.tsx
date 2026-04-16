import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { GetCurrentLoginSession, GetLoginUsers, UserLogin, UserLogout, SwitchLoginSession } from './session';
import type { SessionUser } from './session';

interface SessionContextValue {
    currentUser: SessionUser | null;
    accounts: SessionUser[];
    login: (userData: SessionUser) => void;
    logout: (user?: SessionUser | null) => void;
    switchAccount: (user: SessionUser) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [accounts, setAccounts] = useState<SessionUser[]>(GetLoginUsers());
    const [currentUser, setCurrentUser] = useState<SessionUser | null>(GetCurrentLoginSession());

    const refreshState = () => {
        setAccounts(GetLoginUsers());
        setCurrentUser(GetCurrentLoginSession());
    };

    const login = (userData: SessionUser) => {
        UserLogin(userData);
        refreshState();
    };

    const logout = (user?: SessionUser | null) => {
        UserLogout(user ?? currentUser ?? { user_index_1st: '' });
        refreshState();
    };

    const switchAccount = (user: SessionUser) => {
        SwitchLoginSession(user);
        refreshState();
    };

    // Sync state when session-related localStorage keys change in another tab
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === null || e.key === 'loginaccounts' || e.key === 'currentUserIndex' || e.key?.startsWith('token_')) {
                refreshState();
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return (
        <SessionContext.Provider value={{ currentUser, accounts, login, logout, switchAccount }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession(): SessionContextValue {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}
