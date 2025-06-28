import './header.css'
import Base from '../../base'
import Headeruserstatusbox from '../../userinfo/headeruserstatusbox'

function Usericon() {
    const loginuser = Base.session;
    const Loginusericon = loginuser === null ? <image/> : <image/>;
    return () => (
        <Loginusericon/>
    )
}

function Header() {
    return (
        <header id="headertag" className="layout">
            header
            <div id="headerDiv" className="headerclass">
                headerDiv
                <div id="menubuttonDiv" className="headerclass">
                    <image src=""/>
                </div>
                <div id="headertitle" className="headerclass">
                    title
                </div>
                <div id="headeruserinfoDiv" className="headerclass" onclick="">
                    <Usericon/>
                </div>
            </div>
        </header>
    )
}

export default Header;