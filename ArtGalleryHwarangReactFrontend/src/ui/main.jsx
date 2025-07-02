import base from '../base'
import './main.css'
import Loginpage from '../userinfo/loginpage'
import UserInfoPage from '../userinfo/userinfopage'

let CurrentWin;
export function SwitchWin(winToSwitch) {
    CurrentWin = winToSwitch;
}

function MainWin({winToView, loginusersession}) {
    let isLoggedOn = loginusersession !== null && base.session !== null && loginusersession !== undefined && base.session !== undefined;
    let userpage = isLoggedOn ? <UserInfoPage /> : <Loginpage />;
    if (winToView === undefined || winToView === null) winToView = userpage;
    SwitchWin(winToView);
    let theMain = <div id="mainDiv" className='layout'>{CurrentWin}</div>;
    //console.log("main test: "+window.location.pathname);
    //console.log("Current Tag: "+currentpagename);
    return (theMain);
}

export default MainWin;