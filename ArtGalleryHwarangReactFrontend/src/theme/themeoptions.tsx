import { createContext, useState, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import './theme.css';

export type ThemeName = 'bright-white' | 'darky-black';

interface ThemeContextValue {
    theme: ThemeName;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function getTheme(): ThemeName {
    return (localStorage.getItem('theme') as ThemeName) || 'bright-white';
}

function GetThemeClass(themename: ThemeName): string {
    return themename;
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<ThemeName>(getTheme);

    const value = useMemo(() => ({
        theme,
        toggleTheme: () => {
            const newTheme: ThemeName = theme === 'bright-white' ? 'darky-black' : 'bright-white';
            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        },
    }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextValue => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
    return ctx;
};

export default {
    GetThemeClass
};
