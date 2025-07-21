import localeoptions from './locale/localeoptions.jsx'
import orientationoptions from './ui/orientation/orientationoptions.jsx';
import session from './session.tsx'

const serveraddress = "http://localhost:8000/api/";
export function GetServerAPIAddress(type, submitvalue = '') {
    return serveraddress + type + '/' + submitvalue;
}

let dir = localeoptions.direction
let commonText = localeoptions.currentLocale.Texts.common;
export let dirClass = orientationoptions.GetDir(dir);

export default {
    localeoptions, 
    commonText, 
    orientationoptions, 
    session, 
    serveraddress
}