import React, { useState } from 'react'
import { Link } from "react-router-dom";
import './header.css'
import Base, { useClassNames } from '../../base'
import Headeruserstatusbox from '../../userinfo/headeruserstatusbox'

function DisplayHeaderUserInfoStatusBox() {
}

function Usericon() {
    let loginuser = Base.session.loginaccounts;
    let Loginusericon = 
    loginuser ? <img id="Loginusericon" src=''/> : <div id="UnloggedUserIcon"/>;
    //const Loginusericon = loginuser === null ? <image/> : <image/>;
    return (Loginusericon);
}

function Header({ toggleSidebar }) {
    const [isHeaderUserInfoVisible, setHeaderUserInfoVisibility] = useState(false);
    const getClassNames = useClassNames();
    const toggleInfoBox = () => {
        setHeaderUserInfoVisibility(!isHeaderUserInfoVisible);
    }

    return (
        <header id="headertag" className={getClassNames("layout")}>
            header
            <div id="headerDiv" className={getClassNames("flexboxtype0")}>
                <div id="menubuttonDiv" className={getClassNames()} onClick={toggleSidebar}>
                    Menu<img src=""/>
                </div>
                <div id="headertitle" className={getClassNames()}>
                    <Link to="/">Title</Link>
                </div>
                <div id="headeruserinfoDiv" className={getClassNames()} onClick={toggleInfoBox}>
                    <Usericon/>
                </div>
            </div>
        </header>
    )
}

export default Header;