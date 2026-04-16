import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './signuppage.css';

import { GetServerAPIAddress } from '../base';
import { useLocale } from '../locale/localeoptions';
import { useMessagebox } from '../ui/messagebox/messageboxcontext';

function Signuppage() {
    const navigate = useNavigate();
    const [signupUserIDInput, setSignupUserIDInput] = useState('');
    const [confirmSignupUserIDInput, setConfirmSignupUserIDInput] = useState('');
    const [signupUserPWInput, setSignupUserPWInput] = useState('');
    const [confirmSignupUserPWInput, setConfirmSignupUserPWInput] = useState('');
    const { showMessage } = useMessagebox();
    const { localeTxt } = useLocale();

    const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!signupUserIDInput || !confirmSignupUserIDInput || !signupUserPWInput || !confirmSignupUserPWInput) {
            showMessage(localeTxt.signup.error_AllFieldsRequired || 'All fields are required.');
            return;
        }

        if (signupUserIDInput !== confirmSignupUserIDInput) {
            showMessage(localeTxt.signup.error_UserIDsMismatch || 'User IDs do not match.');
            return;
        }

        if (signupUserPWInput !== confirmSignupUserPWInput) {
            showMessage(localeTxt.signup.error_PasswordsMismatch || 'Passwords do not match.');
            return;
        }

        try {
            const signupdata = { user_id: signupUserIDInput, user_password: signupUserPWInput };
            const signupaddress = GetServerAPIAddress('u', 'api/signup');
            await axios.post(signupaddress, signupdata);
            navigate('/login');
        } catch (error) {
            if (import.meta.env.DEV) console.error('Signup error:', error);
            showMessage('Could not connect to the server. Please try again later.');
        }
    };

    const handleReset = () => {
        setSignupUserIDInput('');
        setConfirmSignupUserIDInput('');
        setSignupUserPWInput('');
        setConfirmSignupUserPWInput('');
        showMessage('');
    };

    return (
        <div id="signupDiv" className="layout"><form id="signupform" className="layout" onSubmit={handleSignup}>
            <table id="signuptable" className="signuptable">
                <thead className="signuptable">
                    <tr>
                        <th colSpan={3}><h2 id="signuptitle" className="signuptitle">{localeTxt.signup.scr_SignUp}</h2></th>
                    </tr>
                </thead>
                <tbody id="signuptablebody" className="signuptable"><tr className="signuptable">
                    <td className="signuptable">
                        <label id="lbl_UserID" className="tablelabel" htmlFor="tbx_UserId_Placeholder">
                            {localeTxt.signup.lbl_UserId}
                        </label>
                    </td>
                    <td className="signuptable">
                        <input id="tbx_UserId_Placeholder" className="inputbox" type="text"
                            placeholder={localeTxt.signup.tbx_UserId_Placeholder}
                            value={signupUserIDInput}
                            onChange={(e) => setSignupUserIDInput(e.target.value)}
                        />
                    </td>
                </tr>
                <tr className="signuptable">
                    <td className="signuptable">
                        <label id="lbl_ConfirmUserID" className="tablelabel" htmlFor="tbx_ConfirmUserID_Placeholder">
                            {localeTxt.signup.lbl_ConfirmUserID}
                        </label>
                    </td>
                    <td className="signuptable">
                        <input id="tbx_ConfirmUserID_Placeholder" className="inputbox" type="text"
                            placeholder={localeTxt.signup.tbx_ConfirmUserID_Placeholder}
                            value={confirmSignupUserIDInput}
                            onChange={(e) => setConfirmSignupUserIDInput(e.target.value)}
                        />
                    </td>
                </tr>
                <tr className="signuptable">
                    <td className="signuptable">
                        <label id="lbl_UserPW" className="tablelabel" htmlFor="tbx_UserPW_Placeholder">
                            {localeTxt.signup.lbl_UserPW}
                        </label>
                    </td>
                    <td className="signuptable">
                        <input id="tbx_UserPW_Placeholder" className="inputbox" type="password"
                            placeholder={localeTxt.signup.tbx_UserPW_Placeholder}
                            value={signupUserPWInput}
                            onChange={(e) => setSignupUserPWInput(e.target.value)}
                        />
                    </td>
                </tr>
                <tr className="signuptable">
                    <td className="signuptable">
                        <label id="lbl_ConfirmUserPW" className="tablelabel" htmlFor="tbx_ConfirmUserPW_Placeholder">
                            {localeTxt.signup.lbl_ConfirmUserPW}
                        </label>
                    </td>
                    <td className="signuptable">
                        <input id="tbx_ConfirmUserPW_Placeholder" className="inputbox" type="password"
                            placeholder={localeTxt.signup.tbx_ConfirmUserPW_Placeholder}
                            value={confirmSignupUserPWInput}
                            onChange={(e) => setConfirmSignupUserPWInput(e.target.value)}
                        />
                    </td>
                </tr></tbody>
            </table>
            <div id="signupbuttonlist" className="flowtype1">
                <button type="submit" className="signupbutton">{localeTxt.signup.btn_Signup}</button>
                <button type="reset" className="signupbutton" onClick={handleReset}>{localeTxt.signup.btn_Reset}</button>
                <button type="button" className="signupbutton">{localeTxt.signup.btn_GoBack}</button>
            </div>
        </form></div>
    );
}

export default Signuppage;
