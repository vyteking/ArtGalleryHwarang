import { useState } from 'react';
import base from '../base';
import './signuppage.css';

const theLocale = base.localeoptions;
const langTxt = theLocale.localeTxt.signup;

function TrySignup(userId, userPW) {
    
}

function Signuppage() {
    return (
        <form id="signupform" class="layout">
            <table id="signuptable" class="layout">
                <tr class="signuptable">
                    <td class="signuptable"><label id="lbl_UserID" class="signuptable" for="tbx_UserID">{langTxt.lbl_UserID}</label></td>
                    <td class="signuptable"><input id="tbx_UserId_Placeholder" class="signuptable" type="text" placeholder={langTxt.tbx_UserId_Placeholder}/></td>
                </tr>
                <tr class="signuptable">
                    <td class="signuptable"><label id="lbl_ConfirmUserID" class="signuptable" for="tbx_ConfirmUserID_Placeholder">{langTxt.lbl_ConfirmUserID}</label></td>
                    <td class="signuptable"><input id="tbx_ConfirmUserID_Placeholder" class="signuptable" type="text" placeholder={langTxt.tbx_ConfirmUserID_Placeholder}/></td>
                </tr>
                <tr class="signuptable">
                    <td class="signuptable"><label id="lbl_UserPW" class="signuptable" for="tbx_UserPW_Placeholder">{langTxt.lbl_UserPW}</label></td>
                    <td class="signuptable"><input id="tbx_UserPW_Placeholder" class="signuptable" type="password" placeholder={langTxt.tbx_UserPW_Placeholder}/></td>
                </tr>
                <tr class="signuptable">
                    <td class="signuptable"><label id="lbl_ConfirmUserPW" class="signuptable" for="tbx_ConfirmUserPW_Placeholder">{langTxt.lbl_ConfirmUserPW}</label></td>
                    <td class="signuptable"><input id="tbx_ConfirmUserPW_Placeholder" class="signuptable" type="password" placeholder={langTxt.tbx_ConfirmUserPW_Placeholder}/></td>
                </tr>
            </table>
            <div class="layout">
                <button type="submit" class="signupbutton">{langTxt.btn_Signup}</button>
                <button type="reset" class="signupbutton">{langTxt.btn_Reset}</button>
                <button type="button" class="signupbutton">{langTxt.btn_GoBack}</button>
            </div>
        </form>
    )
};

export default Signuppage;