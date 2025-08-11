import './mainwin.css'

import PageRoutes from '../pageroutes';
import { Outlet } from 'react-router-dom';

import Base, { GetClassNames } from '../base'

let CurrentWin;
export function SwitchWin(winToSwitch) {
    CurrentWin = winToSwitch;
}

function MainWin({winToView, loginusersession}) {
    // let theMain = <div id="mainDiv" className='layout'><PageRoutes/></div>;
    // return (theMain);
    return (
        <div id="mainDiv" className={GetClassNames('layout')}><PageRoutes/></div>
    );
}

export default MainWin;