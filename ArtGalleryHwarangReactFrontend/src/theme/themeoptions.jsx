import React, { createContext, useState, useContext } from 'react';
import './theme.css';

const ThemeContext = createContext();

export function getTheme() {
    return localStorage.getItem('theme') || 'bright-white';
}

function GetThemeClass(themename) {
    return themename;
}

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(getTheme());

    const toggleTheme = () => {
        const newTheme = theme === 'bright-white' ? 'darky-black' : 'bright-white';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

export default {
    GetThemeClass
};