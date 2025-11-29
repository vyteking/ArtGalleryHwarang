import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import base, { useClassNames } from '../base';
import './homepage.css';

import { useLocale } from '../locale/localeoptions';
import { GetLocaleTexts } from '../locale/localeslist';

function Homepage() {
    const [ loggedInUsers, setLoggedInUsers ] = useState([]);
    const { currentUserSession, setCurrentUserSession } = useState();
    const navigate = useNavigate();
    const getClassNames = useClassNames();
    const localeTxt = GetLocaleTexts();

    useEffect(() => {
        const users = base.session.GetLoginUsers();
        setLoggedInUsers(users);
    }, []);

    function RefreshPage() {
        window.location.reload(false);
    }

    const RedirectPost = () => {
        navigate("/newpost");
    };

    function Logout(logoutuser) {
        try {
            base.session.UserLogout(logoutuser);
            //RefreshPage();
        } catch (ex) {
            console.error(ex);
        }
    }

    function LogoutAll() {
        try {
            base.session.ResetLoginSessions();
            RefreshPage();
        } catch (ex) {
            console.error(ex);
        }
    }

    return (
        <div id="HomeDiv" className={getClassNames("")}>
            {loggedInUsers.length > 0 ? (
                <div>
                    <h2>Logged In Users:</h2>
                    <ul>
                        {loggedInUsers.map(user => (
                            <li key={user.user_index_1st}>
                                <Link to={`/u/${user.user_index_1st}`}>
                                    {user.user_id}
                                </Link> : <button onClick={() => Logout(user)}>Logout</button>
                            </li>
                        ))}
                    </ul>
                    <h3>Current User</h3>
                    <p></p>
                    <button onClick={RedirectPost}>
                        New Post
                    </button>
                    <button id="ResetLoginSessions" onClick={() => LogoutAll()}>Logout All</button>
                </div>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </div>
    );
}

export default Homepage;
