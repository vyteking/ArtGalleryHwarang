import './footer.css'
import Base, { dirClass } from '../../base'

import orientationoptions from '../orientation/orientationoptions';

function Localelist() {
    const locales = [
        {code:'en-GB', name:'English'},
        {code:'es-ES', name:'Español'},
        {code:'fr-FR', name:'Français'},
        {code:'ja-JP', name:'日本語'},
        {code:'zh-TC', name:'繁體中文'},
        {code:'zh-SC', name:'简体中文'},
        {code:'ko-KR', name:'한국어'},
    ];

    return (
        <select id="localelist" className={dirClass}>
            {locales.map((lang) => (
                <option className={"localelistitem "} key={lang.code}>{lang.name}</option>
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