import React, { useState } from 'react'
import { Link } from "react-router-dom";
import './header.css'
import Base from '../../base'
import Headeruserstatusbox from '../../userinfo/headeruserstatusbox'

function DisplayHeaderUserInfoStatusBox() {
}

function Usericon() {
    let loginuser = Base.session;
    let Loginusericon = (loginuser !== null && loginuser !== undefined) ? <img id="Loginusericon" src=''/> : <div id="UnloggedUserIcon"/>;
    //const Loginusericon = loginuser === null ? <image/> : <image/>;
    return (Loginusericon);
}

function Header() {
    const {isHeaderUserInfoVisible, setHeaderUserInfoVisibility} = useState(false);
    const toggleInfoBox = () => {
        setHeaderUserInfoVisibility(!isHeaderUserInfoVisible);
    }

    return (
        <header id="headertag" className="layout headerorientation">
            header
            <div id="headerDiv">
                <div id="menubuttonDiv" className="flexboxtype0">
                    Menu<image src=""/>
                </div>
                <div id="headertitle" className="flexboxtype0">
                    <Link to="/">Title</Link>
                </div>
                <div id="headeruserinfoDiv" className="flexboxtype0" onClick={setHeaderUserInfoVisibility}>
                    User<Usericon/>
                </div>
            </div>
        </header>
    )
}

export default Header;