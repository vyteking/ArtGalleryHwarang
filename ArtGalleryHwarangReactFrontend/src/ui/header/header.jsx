import React, { useState } from 'react'
import { Link } from "react-router-dom";
import './header.css'

import { useLocale } from '../../locale/localeoptions';
import { useClassNames } from '../../base'
import { useSession } from '../../SessionProvider';

function Usericon() {
    const { currentUser } = useSession();

    if (currentUser) {
        // Logged in: Link to user's page with an icon/image
        return (
            <div id="Loginusericon" title={currentUser.user_id} >
                {/* You can put a user avatar here. For now, a placeholder. */}
                {/* <Link to={`/u/${currentUser.user_index_1st}`}>
                    <div id="">

                    </div>
                </Link> */}
            </div>
        );
    } else {
        // Logged out: Link to login page with a generic icon
        return (
            <div id="UnloggedUserIcon" >
                {/* <Link to="/login">
                </Link> */}
            </div>
        );
    }
}

function Header({ toggleSidebar, toggleUserInfoBox }) {
    const getClassNames = useClassNames();
    const { localeTxt } = useLocale();

    return (
        <header id="headertag" className={getClassNames("layout")}>
            <div id="headerDiv" className={getClassNames("flexboxtype1")}>
                <button id="menubuttonspan" className={getClassNames("headerobject")} onClick={toggleSidebar}>
                    {/* {localeTxt.header.menu} */}<img id="menuImg" src=""/>
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