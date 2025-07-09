import React, { useState } from 'react'
import { Link } from "react-router-dom";
import './header.css'
import Base from '../../base'
import Headeruserstatusbox from '../../userinfo/headeruserstatusbox'

import {GetDir} from '../orientation/orientationoptions';
const dir = Base.localeoptions.direction
const dirClass = GetDir(dir);

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
        <header id="headertag" className={'layout '+dirClass}>
            header
            <div id="headerDiv" className={"flexboxtype0 "+dirClass}>
                <div id="menubuttonDiv">
                    Menu<image src=""/>
                </div>
                <div id="headertitle">
                    <Link to="/">Title</Link>
                </div>
                <div id="headeruserinfoDiv" onClick={setHeaderUserInfoVisibility}>
                    User<Usericon/>
                </div>
            </div>
        </header>
    )
}

export default Header;