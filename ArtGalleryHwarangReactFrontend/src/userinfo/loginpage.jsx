import { useState } from 'react';
import base from '../base';
import theMain from '../ui/main'
import './loginpage.css';
import signuppage from './signuppage';

const theLocale = base.localeoptions;
const langTxt = theLocale.localeTxt.login

function LoginError() {
    return (
        <div id="loginErrorWinDiv" className="window">
            <div id="alertDiv" className='alertDiv'></div>
            <button className='alertDiv'></button>
        </div>
    )
}

function TryLogin() {

}

function RedirectSignup() {
    theMain.CurrentWin(signuppage);
}

function Loginpage() {
    const [userID, setUserID] = useState('');
    const [userPW, setUserPW] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(base.serveraddress, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userID, userPW}),
        });

        let result = null;
        if(response.ok) {
            result = await response.json();
            console.log(result);
        } else {
            alert(response.statusText);
        }
    };

    return (
        <div id="loginDiv" className="layout">
            <form id="loginform" className="login" method='POST'>
                <table id="logintable" className="logintable">
                    <thead id="logintableheader" className='logintable'>
                        <tr>
                            <th colSpan={3}><h2 id="logintitle" className="logintitle">{langTxt.scr_Login}</h2></th>
                        </tr>
                    </thead>
                    <tbody id="logintablebody" classname="logintable">
                        <tr classname="logintablerow">
                            <td classname="logintablecolumn"><label htmlFor="userident">{langTxt.lbl_userId}</label></td>
                            <td classname="logintablecolumn" colSpan={2}><input type="text" id="userident" name="userident" value={userID} placeholder={langTxt.tbx_userId_Placeholder} onChange={(e)=>setUserID(e.target.value)} /></td>
                        </tr>
                        <tr classname="logintablerow">
                            <td classname="logintablecolumn"><label htmlFor="userPW">{langTxt.lbl_userPW}:</label></td>
                            <td classname="logintablecolumn" colSpan={2}><input type="password" id="userPW" name="userPW" value={userPW} placeholder={langTxt.tbx_userPW_Placeholder} onChange={(e)=>setUserPW(e.target.value)}/></td>
                        </tr>
                    </tbody>
                </table>
                <table id="logintable" className="loginbuttonstable">
                    <tbody id="logintablebody" classname="loginbuttonstable">
                        <tr classname="loginbuttonstablerow">
                            <td classname="loginbuttonstablecolumn"><button type="button" className="loginbutton" onClick={RedirectSignup}>{langTxt.btn_Signup}</button></td>
                            <td classname="loginbuttonstablecolumn"><button type="reset" className="loginbutton">{langTxt.btn_reset}</button></td>
                            <td classname="loginbuttonstablecolumn"><button type="submit" className="loginbutton">{langTxt.btn_Login}</button></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}

export default Loginpage;