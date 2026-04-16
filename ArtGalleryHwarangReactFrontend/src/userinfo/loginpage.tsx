import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './loginpage.css';

import { useClassNames, GetServerAPIAddress } from '../base';
import { useLocale } from '../locale/localeoptions';
import { useSession } from '../SessionProvider';
import { useMessagebox } from '../ui/messagebox/messageboxcontext';

function Loginpage() {
    const [userID, setUserID] = useState('');
    const [userPW, setUserPW] = useState('');
    const { showMessage } = useMessagebox();

    const navigate = useNavigate();
    const { localeTxt } = useLocale();
    const { login } = useSession();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userID || !userPW) {
            showMessage(localeTxt.login.error_AllFieldsRequired || 'All fields are required.', 'error');
            return;
        }

        const logindata = { user_id: userID, user_password: userPW };
        try {
            const loginaddress = GetServerAPIAddress('u', 'api/login');
            const response = await axios.post(loginaddress, logindata);
            if (import.meta.env.DEV) console.error('Login error:', response.data);
            login(response.data);
            navigate(`/u/${response.data.user_index_1st}`);
        } catch (error) {
            if (import.meta.env.DEV) console.error('Login error:', error);
            showMessage('Could not connect to the server. Please try again later.', 'error');
        }
    };

    const handleReset = () => {
        setUserID('');
        setUserPW('');
    };

    const RedirectSignup = () => {
        navigate('/signup');
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
        </div>
    );
}

export default Loginpage;
