import orientationoptions from './ui/orientation/orientationoptions.jsx';
import themeoptions from './theme/themeoptions.jsx'
import * as session from './authsession.tsx'
import { LocaleProvider, useLocale } from './locale/localeoptions.jsx';
import { useTheme } from './theme/themeoptions.jsx';

const serveraddress = "http://localhost:8000/";
export function GetServerAPIAddress(type, submitvalue = '') {
    return serveraddress + type + '/' + submitvalue;
}

let orientation = orientationoptions.GetDir(0);

// Custom hook to get class names with direction and theme
export function useClassNames() {
    const { theme } = useTheme();
    const themeClass = themeoptions.GetThemeClass(theme);

    return (localclassname) => {
        return localclassname + " " + orientation + " " + themeClass;
    }
};

export default {
    session,
    serveraddress
}