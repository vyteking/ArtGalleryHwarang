import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import base, { useClassNames } from '../base';
import './homepage.css';

import { useLocale } from '../locale/localeoptions';
import { GetLocaleTexts } from '../locale/localeslist';
import type { SessionUser } from '../session';

function Homepage() {
    const [loggedInUsers, setLoggedInUsers] = useState<SessionUser[]>([]);
    const navigate = useNavigate();
    const getClassNames = useClassNames();
    const localeTxt = GetLocaleTexts();

    useEffect(() => {
        const users = base.session.GetLoginUsers();
        setLoggedInUsers(users);
    }, []);

    function RefreshPage() {
        window.location.reload();
    }

    const RedirectPost = () => {
        navigate('/newpost');
    };

    function Logout(logoutuser: SessionUser) {
        base.session.UserLogout(logoutuser);
    }

    function LogoutAll() {
        base.session.ResetLoginSessions();
        RefreshPage();
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
