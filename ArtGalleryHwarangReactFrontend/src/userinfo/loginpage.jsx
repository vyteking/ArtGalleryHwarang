import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

import './loginpage.css';

import base, {GetClassNames, GetServerAPIAddress} from '../base';
import { useLocale } from '../locale/localeoptions';

function LoginError({ message, onClose, direction }) {
    if (!message) return null; // Don't render if there's no message
    return (
        <div id="loginErrorWinDiv" className={GetClassNames("box")}>
            <div id="alertDiv" className={GetClassNames('alertDiv')}>
                <p>{message}</p> {/* Display the error message */}
            </div>
            {/* Added an onClick handler to close the error */}
            <button className={GetClassNames('alertDiv')} onClick={onClose}>Close</button>
        </div>
    );
}

function Loginpage() {
    const [userID, setUserID] = useState('');
    const [userPW, setUserPW] = useState('');
    const [loginError, setLoginError] = useState(null); // State to store login error messages

    const navigate = useNavigate();
    const { localeTxt } = useLocale();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setLoginError(null); // Clear any previous errors

        // Basic validation for non-empty fields (though empty string is handled by === below)
        if (!userID || !userPW) {
            setLoginError(localeTxt.login.error_AllFieldsRequired || 'All fields are required.');
            return;
        }

        const logindata = { user_id: userID, user_password: userPW };
        //axios
        e.preventDefault();
        try {
            const loginaddress = GetServerAPIAddress('login');
            const response = await axios.post(loginaddress, logindata);
            console.log("Login Success:", response.data);
            base.session.UserLogin(response.data);
            navigate(`/u/${response.data.user_index_1st}`);
        } catch (error) {
            console.error("Error creating post:", error);
            setLoginError('Could not connect to the server. Please try again later. \nError: '+error);
        }
    };

    // Handler for the reset button
    const handleReset = () => {
        setUserID('');
        setUserPW('');
        setLoginError('');
    };

    const RedirectSignup = () => {
        navigate("/signup");
    };

    return (
        <div id="loginDiv" className="layout">
            <form id="loginform" className="login" onSubmit={handleSubmit} method='POST'>
                <table id="logintable" className="logintable">
                    <thead id="logintableheader" className='logintable'>
                        <tr>
                            <th colSpan={3}><h2 id="logintitle" className="logintitle">{localeTxt.login.scr_Login}</h2></th>
                        </tr>
                    </thead>
                    {/* Corrected classname to className */}
                    <tbody id="logintablebody" className="logintable">
                        <tr className="logintablerow">
                            <td className="logintablecolumn"><label htmlFor="userIDInput" className='tablelabel'>{localeTxt.login.lbl_userId}</label></td>
                            <td className="logintablecolumn" colSpan={2}>
                                <input
                                    type="text"
                                    id="userIDInput"
                                    name="userID"
                                    className="inputbox"
                                    value={userID}
                                    placeholder={localeTxt.login.tbx_userId_Placeholder}
                                    onChange={(e) => setUserID(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr className="logintablerow">
                            <td className="logintablecolumn"><label htmlFor="userPWInput" className='tablelabel'>{localeTxt.login.lbl_userPW}:</label></td>
                            <td className="logintablecolumn" colSpan={2}>
                                <input
                                    type="password"
                                    id="userPWInput"
                                    name="userPW"
                                    className="inputbox"
                                    value={userPW}
                                    placeholder={localeTxt.login.tbx_userPW_Placeholder}
                                    onChange={(e) => setUserPW(e.target.value)}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div id="loginoptionslist" className="flowtype1">
                    <button type="button" className="loginbutton" onClick={RedirectSignup}>
                        {localeTxt.login.btn_Signup}
                    </button>
                    <button type="reset" className="loginbutton" onClick={handleReset}>
                        {localeTxt.login.btn_reset}
                    </button>
                    <button type="submit" className="loginbutton">
                        {localeTxt.login.btn_Login}
                    </button>
                </div>
            </form>
            {/* Render the LoginError component if there's an error */}
            <LoginError message={loginError} onClose={() => setLoginError(null)} />
        </div>
    );
}

export default Loginpage;
