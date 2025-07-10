import React, { useState } from 'react'
import { Link } from "react-router-dom";
import './header.css'
import Base, { dirClass } from '../../base'
import Headeruserstatusbox from '../../userinfo/headeruserstatusbox'
import orientationoptions from '../orientation/orientationoptions';

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
        <header id="headertag" className={'layout '+dirClass}>
            header
            <div id="headerDiv" className={"flexboxtype0 "+dirClass}>
                <div id="menubuttonDiv" className={dirClass}>
                    Menu<image src=""/>
                </div>
                <div id="headertitle" className={dirClass}>
                    <Link to="/">Title</Link>
                </div>
                <div id="headeruserinfoDiv" className={dirClass} onClick={setHeaderUserInfoVisibility}>
                    <Usericon/>
                </div>
            </div>
        </header>
    )
}

export default Header;