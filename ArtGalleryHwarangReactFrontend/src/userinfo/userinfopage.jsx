import { useState } from 'react';
import base from '../base';
import './signuppage.css';

const theLocale = base.localeoptions;
const langTxt = theLocale.localeTxt.userinfo;

function Userinfopage() {
    return (
        <form id="Userinfopage" class="layout">
            <table id="UserInfoTable">
            <table id="UserInfoTable" class="layout">
                <tr class="userinfotable">
                    <td class="userinfotable"><label id="lbl_UserIdx1st" class="userinfotable" for="tbx_UserIdx1st_Placeholder">{langTxt.userindex1st}</label></td>
                    <td class="userinfotable"><input id="tbx_Current_UserIdx1st" class="userinfotable" type="text" placeholder={langTxt.userindex1st}/></td>
                </tr>
                <tr class="UserInfoTable">
                    <td class="userinfotable"><label id="lbl_UserID" class="userinfotable" for="tbx_UserID">{langTxt.userID}</label></td>
                    <td class="userinfotable"><label id="lbl_Current_UserId" class="userinfotable" type="text" placeholder={langTxt.userID}/></td>
                </tr>
            </table>
            </table>
        </form>
    );
}

export default Userinfopage;