import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { GetCurrentLoginSession, GetLoginUsers, SESSION_CHANGED_EVENT, UserLogin, UserLogout, SwitchLoginSession } from './session';
import type { SessionUser } from './session';
import { revokeServerSession } from './api';

interface SessionContextValue {
    currentUser: SessionUser | null;
    accounts: SessionUser[];
    login: (userData: SessionUser) => void;
    logout: (user?: SessionUser | null) => void;
    switchAccount: (user: SessionUser) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [accounts, setAccounts] = useState<SessionUser[]>(GetLoginUsers);
    const [currentUser, setCurrentUser] = useState<SessionUser | null>(GetCurrentLoginSession);

    const refreshState = useCallback(() => {
        setAccounts(GetLoginUsers());
        setCurrentUser(GetCurrentLoginSession());
    }, []);

    const login = useCallback((userData: SessionUser) => {
        UserLogin(userData);
        refreshState();
    }, [refreshState]);

    const logout = useCallback((user?: SessionUser | null) => {
        const target = user ?? GetCurrentLoginSession();
        if (!target) return;
        // Revoke the token on the server. The account leaves this browser even if that request fails.
        revokeServerSession(target.user_index_1st).catch((error) => {
            if (import.meta.env.DEV) console.error('Logout error:', error);
        });
        UserLogout(target);
        refreshState();
    }, [refreshState]);

    const switchAccount = useCallback((user: SessionUser) => {
        SwitchLoginSession(user);
        refreshState();
    }, [refreshState]);

    useEffect(() => {
        // Sync state when session-related localStorage keys change in another tab
        const handleStorage = (e: StorageEvent) => {
            if (e.key === null || e.key === 'loginaccounts' || e.key === 'currentUserIndex') {
                refreshState();
            }
        };
        window.addEventListener('storage', handleStorage);
        window.addEventListener(SESSION_CHANGED_EVENT, refreshState);
        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener(SESSION_CHANGED_EVENT, refreshState);
        };
    }, [refreshState]);

    const value = useMemo(
        () => ({ currentUser, accounts, login, logout, switchAccount }),
        [currentUser, accounts, login, logout, switchAccount],
    );

    return (
        <SessionContext.Provider value={value}>
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
