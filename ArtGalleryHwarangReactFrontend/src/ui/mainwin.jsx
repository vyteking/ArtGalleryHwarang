import './mainwin.css'

import PageRoutes from '../pageroutes';
import { Outlet } from 'react-router-dom';

import Base, { useClassNames } from '../base'

let CurrentWin;
export function SwitchWin(winToSwitch) {
    CurrentWin = winToSwitch;
}

function MainWin({winToView, loginusersession}) {
    const getClassNames = useClassNames();
    // let theMain = <div id="mainDiv" className='layout'><PageRoutes/></div>;
    // return (theMain);
    return (
        <div id="mainDiv" className={getClassNames('layout')}><PageRoutes/></div>
    );
}

export default MainWin;