import { createContext, useState, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';

interface OrientationContextValue {
    isVertical: boolean;
    toggleVertical: () => void;
}

const OrientationContext = createContext<OrientationContextValue | null>(null);

export const useOrientation = (): OrientationContextValue => {
    const ctx = useContext(OrientationContext);
    if (!ctx) throw new Error('useOrientation must be used within an OrientationProvider');
    return ctx;
};

export const OrientationProvider = ({ children }: { children: ReactNode }) => {
    const [isVertical, setIsVertical] = useState(false);

    const value = useMemo(() => ({
        isVertical,
        toggleVertical: () => setIsVertical(prev => !prev),
    }), [isVertical]);

    return (
        <OrientationContext.Provider value={value}>
            {children}
        </OrientationContext.Provider>
    );
};
