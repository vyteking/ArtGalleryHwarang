import './mainwin.css';

import PageRoutes from '../pageroutes';
import { useClassNames } from '../base';
import Sidebar0 from './sidebar/sidebar0';

let CurrentWin: unknown;
export function SwitchWin(winToSwitch: unknown) {
    CurrentWin = winToSwitch;
}

interface MainWinProps {
    isSidebarVisible: boolean;
    winToView?: unknown;
    loginusersession?: unknown;
}

function MainWin({ isSidebarVisible }: MainWinProps) {
    const getClassNames = useClassNames();

    return (
        <div className="main-container">
            <Sidebar0 isVisible={isSidebarVisible} />
            <div id="mainDiv" className={getClassNames('layout')}><PageRoutes /></div>
        </div>
    );
}

export default MainWin;
