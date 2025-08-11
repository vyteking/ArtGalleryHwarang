import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import base from '../base';
import './homepage.css';

import { useLocale } from '../locale/localeoptions';

function Homepage() {
    const [loggedInUsers, setLoggedInUsers] = useState([]);

    useEffect(() => {
        const users = base.session.GetLoginUsers();
        setLoggedInUsers(users);
    }, []);

    return (
        <div id="HomeDiv">
            {loggedInUsers.length > 0 ? (
                <div>
                    <h2>Logged In Users:</h2>
                    <ul>
                        {loggedInUsers.map(user => (
                            <li key={user.user_index_1st}>
                                <Link to={`/u/${user.user_index_1st}`}>
                                    {user.user_id}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </div>
    );
}

export default Homepage;
