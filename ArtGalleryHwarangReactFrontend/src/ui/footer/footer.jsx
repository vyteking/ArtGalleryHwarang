import { useState } from 'react';
import './footer.css'
import Base, { GetClassNames } from '../../base'
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
    return (
        <footer id="footertag" className={GetClassNames("layout")}>
            <div id='footerDiv' className={GetClassNames("")}>
                <div id="displayoptionDiv" className={GetClassNames("")}>
                    displayoption
                </div>
                <div id="footerdatetimeDiv" className={GetClassNames("")}>
                    datetime
                </div>
                <div id="localeDiv" className={GetClassNames("")}>
                    <Localelist />
                </div>
            </div>
        </footer>
    )
}

export default Footer;
