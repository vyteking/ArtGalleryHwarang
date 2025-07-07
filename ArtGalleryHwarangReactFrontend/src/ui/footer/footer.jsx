import './footer.css'
import Base from '../../base'
// import Base.localeoptions.GetTextorentation;

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
        <select id="localelist">
            {locales.map((lang) => (
                <option className="localelistitem" key={lang.code}>{lang.name}</option>
            ))}
        </select>
    )
}

function Footer() {
    return (
        <footer id="footertag" className="layout">
            <div id='footerDiv' className=''>
                <div id="displayoptionDiv" className="">
                    displayoption
                </div>
                <div id="footerdatetimeDiv" className="">
                    datetime
                </div>
                <div id="localeDiv" className="">
                    <Localelist />
                </div>
            </div>
        </footer>
    )
}

export default Footer;