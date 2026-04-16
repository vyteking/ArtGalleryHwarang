import { useState, useEffect } from 'react';
import './footer.css';
import { useClassNames } from '../../base';
import { GetLocalesList } from '../../locale/localeslist';
import { useLocale } from '../../locale/localeoptions';

function formatDate(date: Date, pattern: string): string {
    const dd   = String(date.getDate()).padStart(2, '0');
    const MM   = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = String(date.getFullYear());
    return pattern
        .replace('dd',   dd)
        .replace('MM',   MM)
        .replace('yyyy', yyyy);
}

function formatTime(date: Date): string {
    const HH = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${HH}:${mm}:${ss}`;
}

function DateTime() {
    const { currentLocale } = useLocale();
    const datePattern = currentLocale.format.dateformat;

    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <span id="footerdatetimeDiv">
            {formatDate(now, datePattern)}&nbsp;&nbsp;{formatTime(now)}
        </span>
    );
}

function Localelist() {
    const locales = GetLocalesList();
    const { currentLocale, setLocale } = useLocale();
    const getClassNames = useClassNames();

    return (
        <select
            id="localelist"
            name="localelist"
            className={getClassNames('')}
            value={currentLocale.LocaleInfo.code}
            onChange={(e) => setLocale(e.target.value)}
        >
            {[...locales.entries()].map(([code, name]) => (
                <option className="localelistitem" key={code} value={code}>
                    {name}
                </option>
            ))}
        </select>
    );
}

interface FooterProps {
    toggleDisplayOption: () => void;
    toggleDateTime: () => void;
}

function Footer({ toggleDisplayOption, toggleDateTime }: FooterProps) {
    const { localeTxt } = useLocale();
    const getClassNames = useClassNames();

    return (
        <footer id="footertag" className={getClassNames('layout')}>
            <div id="footerDiv" className={getClassNames('')}>
                <button id="displayoptionDiv" className={getClassNames('footerobject')} onClick={toggleDisplayOption}>
                    {localeTxt.footer.displayoptions}
                </button>
                <span className={getClassNames('footerobject')} onClick={toggleDateTime} style={{ cursor: 'pointer' }}>
                    <DateTime />
                </span>
                <span id="localeDiv" className={getClassNames('footerobject')}>
                    <Localelist />
                </span>
            </div>
        </footer>
    );
}

export default Footer;
