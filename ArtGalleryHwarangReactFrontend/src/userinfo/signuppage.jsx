import React, { useState, Component } from 'react';
import base from '../base';
import './signuppage.css';

const theLocale = base.localeoptions;
const langTxt = theLocale.localeTxt.signup;

function Signuppage() {
    const [signupUserIDInput, setSignupUserIDInput] = useState('');
    const [confirmSignupUserIDInput, setConfirmSignupUserIDInput] = useState('');
    const [signupUserPWInput, setSignupUserPWInput] = useState('');
    const [confirmSignupUserPWInput, setConfirmSignupUserPWInput] = useState('');
    const [error, setError] = useState('');

    const handleSignup = (event) => { // Accept the event object
        event.preventDefault(); // Prevent default form submission

        setError(''); // Clear previous errors

        // Basic validation for non-empty fields (though empty string is handled by === below)
        if (!signupUserIDInput || !confirmSignupUserIDInput || !signupUserPWInput || !confirmSignupUserPWInput) {
            setError(langTxt.error_AllFieldsRequired || 'All fields are required.');
            return;
        }

        // Check if user IDs match
        if (signupUserIDInput !== confirmSignupUserIDInput) {
            setError(langTxt.error_UserIDsMismatch || 'User IDs do not match.');
            return;
        }

        // Check if passwords match
        if (signupUserPWInput !== confirmSignupUserPWInput) {
            setError(langTxt.error_PasswordsMismatch || 'Passwords do not match.');
            return;
        }

        // If all checks pass, proceed with signup logic (e.g., send to API)
        console.log('Signup successful:', {
            userId: signupUserIDInput,
            password: signupUserPWInput
        });
        alert('Signup successful!'); // Simple feedback for now
        // You would typically call an API here:
        // base.api.signup(signupUserIDInput, signupUserPWInput)
        //    .then(response => { /* handle success */ })
        //    .catch(err => { setError(err.message); });
    };

    // Handler for the reset button
    const handleReset = () => {
        setSignupUserIDInput('');
        setConfirmSignupUserIDInput('');
        setSignupUserPWInput('');
        setConfirmSignupUserPWInput('');
        setError('');
    };

    return (
        <div id="signupDiv" className="layout" ><form id="signupform" className="layout" onSubmit={handleSignup}> {/* onSubmit on the form */}
            <table id="signuptable" className="layout">
                <tr className="signuptable">
                    <td className="signuptable">
                        <label id="lbl_UserID" className="tablelabel" htmlFor="tbx_UserId_Placeholder">
                            {langTxt.lbl_UserId}
                        </label>
                    </td>
                    <td className="signuptable">
                        <input
                            id="tbx_UserId_Placeholder"
                            className="inputbox"
                            type="text"
                            placeholder={langTxt.tbx_UserId_Placeholder}
                            value={signupUserIDInput} // Controlled component
                            onChange={(e) => setSignupUserIDInput(e.target.value)} // Update state on change
                        />
                    </td>
                </tr>
                <tr className="signuptable">
                    <td className="signuptable">
                        <label id="lbl_ConfirmUserID" className="tablelabel" htmlFor="tbx_ConfirmUserID_Placeholder">
                            {langTxt.lbl_ConfirmUserID}
                        </label>
                    </td>
                    <td className="signuptable">
                        <input
                            id="tbx_ConfirmUserID_Placeholder"
                            className="inputbox"
                            type="text"
                            placeholder={langTxt.tbx_ConfirmUserID_Placeholder}
                            value={confirmSignupUserIDInput}
                            onChange={(e) => setConfirmSignupUserIDInput(e.target.value)}
                        />
                    </td>
                </tr>
                <tr className="signuptable">
                    <td className="signuptable">
                        <label id="lbl_UserPW" className="tablelabel" htmlFor="tbx_UserPW_Placeholder">
                            {langTxt.lbl_UserPW}
                        </label>
                    </td>
                    <td className="signuptable">
                        <input
                            id="tbx_UserPW_Placeholder"
                            className="inputbox"
                            type="password"
                            placeholder={langTxt.tbx_UserPW_Placeholder}
                            value={signupUserPWInput}
                            onChange={(e) => setSignupUserPWInput(e.target.value)}
                        />
                    </td>
                </tr>
                <tr className="signuptable">
                    <td className="signuptable">
                        <label id="lbl_ConfirmUserPW" className="tablelabel" htmlFor="tbx_ConfirmUserPW_Placeholder">
                            {langTxt.lbl_ConfirmUserPW}
                        </label>
                    </td>
                    <td className="signuptable">
                        <input
                            id="tbx_ConfirmUserPW_Placeholder"
                            className="inputbox"
                            type="password"
                            placeholder={langTxt.tbx_ConfirmUserPW_Placeholder}
                            value={confirmSignupUserPWInput}
                            onChange={(e) => setConfirmSignupUserPWInput(e.target.value)}
                        />
                    </td>
                </tr>
            </table>
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>} {/* Display error message */}
            <div id="signupbuttonlist" className="layout">
                {/* button type="submit" will trigger onSubmit on the form */}
                <button type="submit" className="signupbutton">
                    {langTxt.btn_Signup}
                </button>
                {/* Reset button should have its own click handler or rely on type="reset" */}
                <button type="reset" className="signupbutton" onClick={handleReset}>
                    {langTxt.btn_Reset}
                </button>
                <button type="button" className="signupbutton">
                    {langTxt.btn_GoBack}
                </button>
            </div>
        </form></div>
    )
};

export default Signuppage;