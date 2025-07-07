import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';

import './loginpage.css';

import base from '../base';
const theLocale = base.localeoptions;
const langTxt = theLocale.localeTxt.login;

// It's good practice to define helper/display components in the same file if they're small
// or in a separate file if they are reusable.
function LoginError({ message, onClose }) {
    if (!message) return null; // Don't render if there's no message
    return (
        <div id="loginErrorWinDiv" className="window">
            <div id="alertDiv" className='alertDiv'>
                <p>{message}</p> {/* Display the error message */}
            </div>
            {/* Added an onClick handler to close the error */}
            <button className='alertDiv' onClick={onClose}>Close</button>
        </div>
    );
}

function Loginpage() {
    const [userID, setUserID] = useState('');
    const [userPW, setUserPW] = useState('');
    const [loginError, setLoginError] = useState(null); // State to store login error messages

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setLoginError(null); // Clear any previous errors

        try {
            const response = await fetch(base.serveraddress, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userID, userPW }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Login successful:', result);
                // Handle successful login, e.g., redirect to dashboard, store token
                alert('Login successful!'); // For demonstration
                // Example: Main.SwitchWin(DashboardPage);
            } else {
                // If response.ok is false, try to get a more specific error from the body
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                setLoginError(errorData.message || 'An unknown error occurred during login.');
            }
        } catch (error) {
            // Handle network errors or other exceptions
            console.error('Network or other error:', error);
            setLoginError('Could not connect to the server. Please try again later.');
        }
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
                            <th colSpan={3}><h2 id="logintitle" className="logintitle">{langTxt.scr_Login}</h2></th>
                        </tr>
                    </thead>
                    {/* Corrected classname to className */}
                    <tbody id="logintablebody" className="logintable">
                        <tr className="logintablerow">
                            <td className="logintablecolumn"><label htmlFor="userIDInput" className='tablelabel'>{langTxt.lbl_userId}</label></td>
                            <td className="logintablecolumn" colSpan={2}>
                                <input
                                    type="text"
                                    id="userIDInput"
                                    name="userID"
                                    className="inputbox"
                                    value={userID}
                                    placeholder={langTxt.tbx_userId_Placeholder}
                                    onChange={(e) => setUserID(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr className="logintablerow">
                            <td className="logintablecolumn"><label htmlFor="userPWInput" className='tablelabel'>{langTxt.lbl_userPW}:</label></td>
                            <td className="logintablecolumn" colSpan={2}>
                                <input
                                    type="password"
                                    id="userPWInput"
                                    name="userPW"
                                    className="inputbox"
                                    value={userPW}
                                    placeholder={langTxt.tbx_userPW_Placeholder}
                                    onChange={(e) => setUserPW(e.target.value)}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div id="loginoptionslist" className="flowtype1">
                    <button type="button" className="loginbutton" onClick={RedirectSignup}>
                        {langTxt.btn_Signup}
                    </button>
                    <button type="reset" className="loginbutton">
                        {langTxt.btn_reset}
                    </button>
                    <button type="submit" className="loginbutton">
                        {langTxt.btn_Login}
                    </button>
                </div>
            </form>
            {/* Render the LoginError component if there's an error */}
            <LoginError message={loginError} onClose={() => setLoginError(null)} />
        </div>
    );
}

export default Loginpage;