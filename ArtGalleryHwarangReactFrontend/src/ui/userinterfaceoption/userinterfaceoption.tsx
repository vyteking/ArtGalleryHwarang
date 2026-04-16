import { useClassNames } from '../../base'

import './userinterfaceoption.css'

import { useLocale } from '../../locale/localeoptions';
import { useOrientation } from '../orientation/OrientationContext';
import { isSupportingVerticalText } from '../orientation/orientationoptions';

const VerticalLayoutOption = () => {
    const { direction } = useLocale();
    const { localeTxt } = useLocale();
    const getClassNames = useClassNames();
    const { isVertical, toggleVertical } = useOrientation();

    if (!isSupportingVerticalText(direction)) {
        return null;
    }

    return (
        <div id="EnableVerticalLayout" className={getClassNames("")}>
            <input 
                type="checkbox" 
                id="CheckboxEnableVerticalLayout"
                checked={isVertical}
                onChange={toggleVertical}
            />
            <label htmlFor="CheckboxEnableVerticalLayout">{localeTxt.userinterfaceoptions.enable_vertical_direction}</label>
        </div>
    );
};

function Userinterfaceoptionwindow({ toggleVisibility }) {
    const { localeTxt } = useLocale();
    const getClassNames = useClassNames();

    const saveUIOption = () => {
        // Future implementation: save options
        toggleVisibility(); // Close window on save for now
    }

    const closeUIOptWin = () => {
        toggleVisibility(); // Call the function passed from App.jsx
    }

    return (
        <div id="UIOptionDiv" className={getClassNames("box")}>
            <div id="UIOptionTable" className={getClassNames("layout")}>
                    <div className={getClassNames("")}>
                        <div className={getClassNames("")}>{localeTxt.userinterfaceoptions.language}</div>
                        <div className={getClassNames("")}></div>
                    </div>
                    <VerticalLayoutOption />
                    <div className={getClassNames("")}>
                        <div className={getClassNames("")}>{localeTxt.userinterfaceoptions.theme}</div>
                        <div className={getClassNames("")}></div>
                    </div>
                    <div className={getClassNames("")}>
                        <button className={getClassNames("")} onClick={saveUIOption}>{localeTxt.common.OK}</button>
                        <button className={getClassNames("")} onClick={closeUIOptWin}>{localeTxt.common.Cancel}</button>
                    </div>
            </div>
        </div>
    );
}

export default Userinterfaceoptionwindow;