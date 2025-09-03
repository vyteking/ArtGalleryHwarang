import { useState } from 'react';
import './footer.css'
import Base, { useClassNames } from '../../base'
import { GetLocalesList } from '../../locale/localeslist';
import { useLocale } from '../../locale/localeoptions';

function Localelist() {
    const locales = GetLocalesList();
    const { currentLocale, setLocale } = useLocale();
    const [selectedLocale, setSelectedLocale] = useState(currentLocale.LocaleInfo.code);

    return (
            <select
                id="localelist"
                name="localelist"
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
    )
}

function Footer() {
    const getClassNames = useClassNames();
    return (
        <footer id="footertag" className={getClassNames("layout")}>
            <div id='footerDiv' className={getClassNames("")}>
                <div id="displayoptionDiv" className={getClassNames("")}>
                    displayoption
                </div>
                <div id="footerdatetimeDiv" className={getClassNames("")}>
                    datetime
                </div>
                <div id="localeDiv" className={getClassNames("")}>
                    <Localelist />
                </div>
            </div>
        </footer>
    )
}

export default Footer;