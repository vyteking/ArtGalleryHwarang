import React, { useState } from 'react'
import { Link } from "react-router-dom";
import './header.css'
// import '../orientation/orientationoptions'
import Base, { useClassNames } from '../../base'

function Usericon() {
    let loginuser = Base.session.loginaccounts;
    let Loginusericon = 
    loginuser ? <img id="Loginusericon" src=''/> : <div id="UnloggedUserIcon"/>;
    //const Loginusericon = loginuser === null ? <image/> : <image/>;
    return (Loginusericon);
}

function Header({ toggleSidebar, toggleUserInfoBox }) {
    const getClassNames = useClassNames();

    return (
        <header id="headertag" className={getClassNames("layout")}>
            header
            <div id="headerDiv" className={getClassNames("flexboxtype1")}>
                <span id="menubuttonspan" className={getClassNames("headerobject")} onClick={toggleSidebar}>
                    Menu<img id="menuImg" src=""/>
                </span>
                <span id="headercentre" className={getClassNames("headerobject")}>
                    <span id="headertitle" className={getClassNames("headerobject")}>
                        <Link to="/">Title<img id="titleImg" src=""/></Link>
                    </span>
                </span>
                <span id="headeruserinfospan" className={getClassNames("headerobject")} onClick={toggleUserInfoBox}>
                    <Usericon/>
                </span>
            </div>
        </header>
    )
}

export default Header;