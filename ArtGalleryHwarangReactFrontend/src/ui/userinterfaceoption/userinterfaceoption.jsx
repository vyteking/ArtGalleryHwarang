import { useClassNames } from '../../base'

import './userinterfaceoption.css'

import { useLocale } from '../../locale/localeoptions';
import { useOrientation } from '../orientation/OrientationContext';
import { isSupportingVerticalText } from '../orientation/orientationoptions';

const VerticalLayoutOption = () => {
    const { direction, localeTxt } = useLocale();
    const { isVertical, toggleVertical } = useOrientation();

    if (!isSupportingVerticalText(direction)) {
        return null;
    }

    return (
        <div id="EnableVerticalLayout">
            <input 
                type="checkbox" 
                id="CheckboxEnableVerticalLayout"
                checked={isVertical}
                onChange={toggleVertical}
            />
            <label htmlFor="CheckboxEnableVerticalLayout">{localeTxt.Texts.userinterfaceoptions.enable_vertical_direction}</label>
        </div>
    );
};

function Userinterfaceoptionwindow() {
    const { localeTxt } = useLocale();
    const getClassNames = useClassNames();

    const saveUIOption = () => {

    }

    const closeUIOptWin = () => {

    }

    return (
        <div id="UIOptionDiv" className={getClassNames("box")}>
            <div id="UIOptionTable" className={getClassNames("layout")}>
                    <div>
                        <div>{localeTxt.Texts.userinterfaceoptions.language}</div>
                        <div></div>
                    </div>
                    <VerticalLayoutOption />
                    <div>
                        <button onClick={saveUIOption}>{localeTxt.Texts.common.OK}</button>
                        <button onClick={closeUIOptWin}>{localeTxt.Texts.common.Cancel}</button>
                    </div>
            </div>
        </div>
    );
}

export default Userinterfaceoptionwindow;