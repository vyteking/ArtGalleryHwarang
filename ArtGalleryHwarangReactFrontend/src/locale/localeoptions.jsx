import React, { useState, useEffect, createContext, useContext } from 'react';
import i18n from '../i18n'; // Import i18n instance
import { GetLocaleTexts, GetLocalesList } from './localeslist';

// Create the LocaleContext
const LocaleContext = createContext(null);

// Custom hook to use the locale context
export const useLocale = () => useContext(LocaleContext);

// LocaleProvider component
export const LocaleProvider = ({ children }) => {
    const [currentLocale, setCurrentLocale] = useState(() => GetLocaleTexts(i18n.language));

    useEffect(() => {
        const handleLanguageChange = (lng) => {
            if (!i18n.hasResourceBundle(lng, 'translation')) {
                const newLocale = GetLocaleTexts(lng);
                if (newLocale) {
                    i18n.addResourceBundle(lng, 'translation', newLocale.Texts);
                }
            }
            setCurrentLocale(GetLocaleTexts(lng));
        };

        i18n.on('languageChanged', handleLanguageChange);
        
        // Initial load
        handleLanguageChange(i18n.language);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, []);

    const setLocale = (selectedLocaleCode) => {
        i18n.changeLanguage(selectedLocaleCode);
    };

    const contextValue = {
        currentLocale,
        localeTxt: currentLocale?.Texts,
        direction: currentLocale?.LocaleInfo.direction,
        locales: GetLocalesList(),
        setLocale,
    };

    return (
        <LocaleContext.Provider value={contextValue}>
            {children}
        </LocaleContext.Provider>
    );
};