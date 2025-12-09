import React, { useState } from 'react'
import { Link } from "react-router-dom";
import './header.css'
// import '../orientation/orientationoptions'
import { useClassNames } from '../../base'
import { useSession } from '../../SessionProvider';

function Usericon() {
    const { currentUser } = useSession();

    if (currentUser) {
        // Logged in: Link to user's page with an icon/image
        return (
            <Link to={`/u/${currentUser.user_index_1st}`}>
                {/* You can put a user avatar here. For now, a placeholder. */}
                <div id="Loginusericon" title={currentUser.user_id} />
            </Link>
        );
    } else {
        // Logged out: Link to login page with a generic icon
        return (
            <Link to="/login">
                <div id="UnloggedUserIcon" />
            </Link>
        );
    }
}

function Header({ toggleSidebar, toggleUserInfoBox }) {
    const getClassNames = useClassNames();

    return (
        <header id="headertag" className={getClassNames("layout")}>
            header
            <div id="headerDiv" className={getClassNames("flexboxtype1")}>
                <button id="menubuttonspan" className={getClassNames("headerobject")} onClick={toggleSidebar}>
                    Menu<img id="menuImg" src=""/>
                </button>
                <span id="headercentre" className={getClassNames("headerobject")}>
                    <span id="headertitle" className={getClassNames("headerobject")}>
                        <Link to="/">Title<img id="titleImg" src=""/></Link>
                    </span>
                </span>
                {/* The span below can still toggle a dropdown, but the icon inside is now reactive */}
                <span id="headeruserinfospan" className={getClassNames("headerobject")} onClick={toggleUserInfoBox}>
                    <Usericon/>
                </span>
            </div>
        </header>
    )
}

export default Header;