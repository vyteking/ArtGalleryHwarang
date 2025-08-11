import React, { useState } from 'react'
import { Link } from "react-router-dom";
import './header.css'
import Base, { GetClassNames } from '../../base'
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

function Header() {
    const {isHeaderUserInfoVisible, setHeaderUserInfoVisibility} = useState(false);
    const toggleInfoBox = () => {
        setHeaderUserInfoVisibility(!isHeaderUserInfoVisible);
    }

    return (
        <header id="headertag" className={GetClassNames("layout")}>
            header
            <div id="headerDiv" className={GetClassNames("flexboxtype0")}>
                <div id="menubuttonDiv" className={GetClassNames()}>
                    Menu<image src=""/>
                </div>
                <div id="headertitle" className={GetClassNames()}>
                    <Link to="/">Title</Link>
                </div>
                <div id="headeruserinfoDiv" className={GetClassNames()} onClick={setHeaderUserInfoVisibility}>
                    <Usericon/>
                </div>
            </div>
        </header>
    )
}

export default Header;