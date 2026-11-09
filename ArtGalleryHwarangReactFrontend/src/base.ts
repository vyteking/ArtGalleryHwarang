import { getDir } from './ui/orientation/orientationoptions';
import themeoptions from './theme/themeoptions';
import * as session from './session.tsx';
import { useLocale } from './locale/localeoptions';
import { useTheme } from './theme/themeoptions';
import { useOrientation } from './ui/orientation/OrientationContext';
import { API_BASE, GetServerAPIAddress } from './api';

export { GetServerAPIAddress };

const serveraddress = API_BASE;

export function useClassNames(): (localclassname: string) => string {
    const { direction } = useLocale();
    const { theme } = useTheme();
    const { isVertical } = useOrientation();

    const orientation = getDir(direction, isVertical);
    const themeClass = themeoptions.GetThemeClass(theme);

    return (localclassname: string) => {
        return `${localclassname} ${orientation} ${themeClass}`;
    };
}

export default {
    session,
    serveraddress
}
