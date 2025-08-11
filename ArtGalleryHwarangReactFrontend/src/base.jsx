import orientationoptions from './ui/orientation/orientationoptions.jsx';
import themeoptions from './theme/themeoptions.jsx'
import session from './session.tsx'
import { LocaleProvider, useLocale } from './locale/localeoptions.jsx';

const serveraddress = "http://localhost:8000/api/";
export function GetServerAPIAddress(type, submitvalue = '') {
    return serveraddress + type + '/' + submitvalue;
}

let orientation = orientationoptions.GetDir(0);
let themeClass = themeoptions.GetThemeClass("");

// Custom hook to get class names with direction and theme
export function GetClassNames(localclassname) {
    const themeClass = themeoptions.GetThemeClass("");

    return localclassname + " " + orientation + " " + themeClass;
};

export default {
    session,
    serveraddress
}
