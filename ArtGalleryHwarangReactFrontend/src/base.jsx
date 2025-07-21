// import { GetDir } from './locale/localetextgetter.jsx';
import localeoptions from './locale/localeoptions.jsx'
import orientationoptions from './ui/orientation/orientationoptions.jsx';
import themeoptions from './theme/themeoptions.jsx'
import session from './session.tsx'

const serveraddress = "http://localhost:8000/api/";
export function GetServerAPIAddress(type, submitvalue = '') {
    return serveraddress + type + '/' + submitvalue;
}

let dir = localeoptions.direction;
let commonText = localeoptions.currentLocale.Texts.common;
export let dirClass = orientationoptions.GetDir(0);

let themeClass = themeoptions.GetThemeClass("");

export function GetClassNames(localclassname) {
    return localclassname + " " + dirClass + " " + themeClass;
}

export default {
    localeoptions, 
    //commonText, 
    //orientationoptions, 
    session, 
    serveraddress
}