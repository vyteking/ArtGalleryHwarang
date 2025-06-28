import base from '../base'
import './main.css'
import Loginpage from '../userinfo/loginpage'

function CurrentWin({currentWin}) {
    if (currentWin === null) currentWin = <Loginpage />;

    return (currentWin);
}

function MainWin({currentWin, loginusersession}) {
    let loginuser_ = loginusersession;
    let theMain = <div id="mainDiv" className='layout'><CurrentWin currentWin={currentWin} /></div>;

    return (theMain);
}

export default MainWin;