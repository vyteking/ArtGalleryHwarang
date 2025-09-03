import React, { useState, useEffect } from 'react';
import base, { useClassNames } from '../base';
import { useLocale } from '../locale/localeoptions';
import './userinfopage.css';

function Userinfopage() {
    const [loggedInUsers, setLoggedInUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const { localeTxt } = useLocale();
    const getClassNames = useClassNames();

    useEffect(() => {
        const users = base.session.GetLoginUsers();
        setLoggedInUsers(users);
        if (users.length > 0) {
            setSelectedUser(users[0]);
        }
    }, []);

    return (
        <div id="UserinfopageContainer" className={getClassNames("layout")}>
            <h2>{localeTxt.userinfo.your_login_sessions || "Your Login Sessions:"}</h2>
            {loggedInUsers.length > 0 ? (
                <div>
                    <div className="user-list">
                        {loggedInUsers.map(user => (
                            <button
                                key={user.user_index_1st}
                                onClick={() => setSelectedUser(user)}
                                className={selectedUser && selectedUser.user_index_1st === user.user_index_1st ? 'selected' : ''}
                            >
                                {user.user_id}
                            </button>
                        ))}
                    </div>

                    {selectedUser && (
                        <form id="UserInfoDisplayForm" className={getClassNames("layout")}>
                            <h3>{localeTxt.userinfo.details_for || "Details for"} {selectedUser.user_id}:</h3>
                            <table id="UserInfoTable" className="layout">
                                <tbody>
                                    <tr className="userinfotable">
                                        <td className="userinfotable">
                                            <label id="lbl_UserIdx1st" className="userinfotable" htmlFor="tbx__Current_UserIdx1st">
                                                {localeTxt.userinfo.userindex1st}
                                            </label>
                                        </td>
                                        <td className="userinfotable">
                                            <input
                                                id="tbx_Current_UserIdx1st"
                                                className="userinfotable"
                                                type="text"
                                                value={selectedUser.user_index_1st || ''}
                                                readOnly
                                            />
                                        </td>
                                    </tr>
                                    <tr className="UserInfoTable">
                                        <td className="userinfotable">
                                            <label id="lbl_UserID" className="userinfotable" htmlFor="lbl_Current_UserId">
                                                {localeTxt.userinfo.userID}
                                            </label>
                                        </td>
                                        <td className="userinfotable">
                                            <span id="lbl_Current_UserId" className="userinfotable">
                                                {selectedUser.user_id}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    )}
                </div>
            ) : (
                <p>{localeTxt.userinfo.no_active_login_sessions || "No active login sessions found."}</p>
            )}
        </div>
    );
}

export default Userinfopage;