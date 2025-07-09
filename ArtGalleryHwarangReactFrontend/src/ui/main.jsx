import './main.css'

import PageRoutes from '../pageroutes';
import { Outlet } from 'react-router-dom';

import Base from '../base'
import orientationoptions, {GetDir} from './orientation/orientationoptions';
const dir = Base.localeoptions.direction
const dirClass = GetDir(dir);

let CurrentWin;
export function SwitchWin(winToSwitch) {
    CurrentWin = winToSwitch;
}

function MainWin({winToView, loginusersession}) {
    // let theMain = <div id="mainDiv" className='layout'><PageRoutes/></div>;
    // return (theMain);
    return (
        <div id="mainDiv" className={'layout '+dirClass}><PageRoutes/></div>
    );
}

export default MainWin;