import { useState } from 'react';
import './footer.css'
import Base, { useClassNames } from '../../base'
import { GetLocalesList } from '../../locale/localeslist';
import { useLocale } from '../../locale/localeoptions';

function Localelist() {
    const locales = GetLocalesList();
    const getClassNames = useClassNames();
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
    )
}

function Footer() {
    const getClassNames = useClassNames();
    return (
        <footer id="footertag" className={getClassNames("layout")}>
            <div id='footerDiv' className={getClassNames("")}>
                <span id="displayoptionDiv" className={getClassNames("footerobject")}>
                    displayoption
                </span>
                <span id="footerdatetimeDiv" className={getClassNames("footerobject")}>
                    datetime
                </span>
                <span id="localeDiv" className={getClassNames("footerobject")}>
                    <Localelist />
                </span>
            </div>
        </footer>
    )
}

export default Footer;