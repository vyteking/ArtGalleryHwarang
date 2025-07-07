import React, { useState } from 'react'
import { Link } from "react-router-dom";
import './header.css'
import Base from '../../base'
import Headeruserstatusbox from '../../userinfo/headeruserstatusbox'

function DisplayHeaderUserInfoStatusBox() {
    
}

function Usericon() {
    let loginuser = Base.session;
    let Loginusericon = (loginuser !== null && loginuser !== undefined) ? <img id="Loginusericon"/> : <div id="UnloggedUserIcon"/>;
    //const Loginusericon = loginuser === null ? <image/> : <image/>;
    return (Loginusericon);
}

function Header() {
    return (
        <header id="headertag" className="layout">
            header
            <div id="headerDiv" className="">
                <div id="menubuttonDiv" className="">
                    Menu<image src=""/>
                </div>
                <div id="headertitle" className="">
                    <Link to="/">Title</Link>
                </div>
                <div id="headeruserinfoDiv" className="" onclick="DisplayHeaderUserInfoStatusBox()">
                    User<Usericon/>
                </div>
            </div>
        </header>
    )
}

export default Header;