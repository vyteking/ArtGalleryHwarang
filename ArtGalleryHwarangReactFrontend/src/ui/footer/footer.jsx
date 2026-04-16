import { useState, useEffect } from 'react';
import './footer.css'
import { useClassNames } from '../../base'
import { GetLocalesList } from '../../locale/localeslist';
import { useLocale } from '../../locale/localeoptions';

// Format a Date using the locale's dateformat pattern (dd/MM/yyyy etc.)
function formatDate(date, pattern) {
    const dd   = String(date.getDate()).padStart(2, '0');
    const MM   = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = String(date.getFullYear());
    return pattern
        .replace('dd',   dd)
        .replace('MM',   MM)
        .replace('yyyy', yyyy);
}

function formatTime(date) {
    const HH = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${HH}:${mm}:${ss}`;
}

function DateTime() {
    const { currentLocale } = useLocale();
    const datePattern = currentLocale?.format?.dateformat ?? 'yyyy-MM-dd';

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
    const [selectedLocale, setSelectedLocale] = useState(currentLocale.LocaleInfo.code);
    const getClassNames = useClassNames();

    return (
        <select
            id="localelist"
            name="localelist"
            className={getClassNames("")}
            value={selectedLocale}
            onChange={(e) => {
                const val = e.target.value;
                setSelectedLocale(val);
                setLocale(val);
            }}
        >
            {[...locales.entries()].map(([code, name]) => (
                <option className="localelistitem" key={code} value={code}>
                    {name}
                </option>
            ))}
        </select>
    );
}

function Footer({ toggleDisplayOption, toggleDateTime }) {
    const getClassNames = useClassNames();
    return (
        <footer id="footertag" className={getClassNames("layout")}>
            <div id='footerDiv' className={getClassNames("")}>
                <button id="displayoptionDiv" className={getClassNames("footerobject")} onClick={toggleDisplayOption}>
                    displayoption
                </button>
                <span className={getClassNames("footerobject")} onClick={toggleDateTime} style={{ cursor: 'pointer' }}>
                    <DateTime />
                </span>
                <span id="localeDiv" className={getClassNames("footerobject")}>
                    <Localelist />
                </span>
            </div>
        </footer>
    );
}

export default Footer;
