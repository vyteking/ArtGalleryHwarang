import './mainwin.css'

import PageRoutes from '../pageroutes';
import { Outlet } from 'react-router-dom';

import Base, { useClassNames } from '../base'
import Sidebar0 from './sidebar/sidebar0';

let CurrentWin;
export function SwitchWin(winToSwitch) {
    CurrentWin = winToSwitch;
}

function MainWin({isSidebarVisible, winToView, loginusersession}) {
    const getClassNames = useClassNames();
    // let theMain = <div id="mainDiv" className='layout'><PageRoutes/></div>;
    // return (theMain);
    return (
        <div className="main-container">
            <Sidebar0 isVisible={isSidebarVisible} />
            <div id="mainDiv" className={getClassNames('layout')}><PageRoutes/></div>
        </div>
    );
}

export default MainWin;