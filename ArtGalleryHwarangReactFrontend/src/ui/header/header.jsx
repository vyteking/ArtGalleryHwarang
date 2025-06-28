import './header.css'
import Headeruserstatusbox from '../../userinfo/headeruserstatusbox'

function Usericon({loginuser}) {
    const Loginusericon = loginuser === null ? <image/> : <image/>;
    return () => (
        <Loginusericon/>
    )
}

function Header({loginusersession}) {
    return (
        <header id="headertag" className="layout">
            header
            <div id="headerDiv" className="headerclass">
                headerDiv
                <div id="menubuttonDiv" className="headerclass">
                    menu
                </div>
                <div id="headertitle" className="headerclass">
                    title
                </div>
                <div id="headeruserinfoDiv" className="headerclass" onclick="">
                    <Usericon loginuser={loginusersession}/>
                </div>
            </div>
        </header>
    )
}

export default Header;