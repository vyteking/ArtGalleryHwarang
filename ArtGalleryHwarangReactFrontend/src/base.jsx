import localeoptions from './localeoptions'
import orientationoptions from './ui/orientation/orientationoptions.jsx';
import session from './session.tsx'

const serveraddress = "http://localhost:8000/api/";

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