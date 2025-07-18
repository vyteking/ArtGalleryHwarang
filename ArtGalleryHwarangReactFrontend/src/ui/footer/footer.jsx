import './footer.css'
import Base, { dirClass } from '../../base'

import orientationoptions from '../orientation/orientationoptions';
import { GetLocalesList } from '../../locale/localeslist';

function Localelist() {
    const locales = GetLocalesList();

    return (
        <select id="localelist" className={dirClass}>
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
        <footer id="footertag" className={'layout '+dirClass}>
            <div id='footerDiv' className={dirClass}>
                <div id="displayoptionDiv" className={dirClass}>
                    displayoption
                </div>
                <div id="footerdatetimeDiv" className={dirClass}>
                    datetime
                </div>
                <div id="localeDiv" className={dirClass}>
                    <Localelist />
                </div>
            </div>
        </footer>
    )
}

export default Footer;