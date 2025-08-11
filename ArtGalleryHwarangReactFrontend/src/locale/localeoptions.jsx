import React, { useState, useEffect, createContext, useContext } from 'react';
import localeloader from './localetextfiles/en.json' //English as temporarily
import { GetLocaleTexts } from './localeslist';

// Create the LocaleContext
const LocaleContext = createContext(null);

// Custom hook to use the locale context
export const useLocale = () => useContext(LocaleContext);

// LocaleProvider component
export const LocaleProvider = ({ children }) => {
    const [currentLocale, setCurrentLocale] = useState(localeloader);

    const setLocale = (selectedLocaleCode) => {
        const newLocale = GetLocaleTexts(selectedLocaleCode);
        setCurrentLocale(newLocale);
    };

    const contextValue = {
        currentLocale,
        localeTxt: currentLocale.Texts,
        direction: currentLocale.LocaleInfo.direction,
        setLocale,
    };

    return (
        <LocaleContext.Provider value={contextValue}>
            {children}
        </LocaleContext.Provider>
    );
};

// Function to load JSON locale files from `locale` folder (still incomplete)
const LoadLocaleList = (r) => {
    let files = {};
    let localefolderpath = './localetextfiles/';
    r.Keys().forEach((itm) => {})
}