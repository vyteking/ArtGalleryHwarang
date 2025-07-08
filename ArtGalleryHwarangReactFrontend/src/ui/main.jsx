import base from '../base'
import './main.css'

import PageRoutes from '../pageroutes';
import { Outlet } from 'react-router-dom';

let CurrentWin;
export function SwitchWin(winToSwitch) {
    CurrentWin = winToSwitch;
}

function MainWin({winToView, loginusersession}) {
    // let theMain = <div id="mainDiv" className='layout'><PageRoutes/></div>;
    // return (theMain);
    return (
        <div id="mainDiv" className='layout mainorientation'><PageRoutes/></div>
    );
}

export default MainWin;