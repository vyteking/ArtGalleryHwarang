import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import i18n from '../i18n';
import { GetLocaleTexts, GetLocalesList } from './localeslist';
import type { LocaleData, LocaleTexts } from './locale.types';
import type { Direction } from '../ui/orientation/orientationoptions';

interface LocaleContextValue {
    currentLocale: LocaleData;
    localeTxt: LocaleTexts;
    direction: Direction;
    locales: Map<string, string>;
    setLocale: (code: string) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export const useLocale = (): LocaleContextValue => {
    const ctx = useContext(LocaleContext);
    if (!ctx) throw new Error('useLocale must be used within a LocaleProvider');
    return ctx;
};

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
    const [currentLocale, setCurrentLocale] = useState<LocaleData>(() => GetLocaleTexts(i18n.language));

    useEffect(() => {
        const handleLanguageChange = (lng: string) => {
            if (!i18n.hasResourceBundle(lng, 'translation')) {
                const newLocale = GetLocaleTexts(lng);
                if (newLocale) {
                    i18n.addResourceBundle(lng, 'translation', newLocale.Texts);
                }
            }
            setCurrentLocale(GetLocaleTexts(lng));
        };

        i18n.on('languageChanged', handleLanguageChange);
        handleLanguageChange(i18n.language);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, []);

    const setLocale = (selectedLocaleCode: string) => {
        i18n.changeLanguage(selectedLocaleCode);
    };

    const contextValue: LocaleContextValue = {
        currentLocale,
        localeTxt: currentLocale.Texts,
        direction: currentLocale.LocaleInfo.direction as Direction,
        locales: GetLocalesList(),
        setLocale,
    };

    return (
        <LocaleContext.Provider value={contextValue}>
            {children}
        </LocaleContext.Provider>
    );
};
