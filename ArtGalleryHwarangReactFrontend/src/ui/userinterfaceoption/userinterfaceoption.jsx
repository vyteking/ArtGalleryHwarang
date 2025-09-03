import Base, { useClassNames, GetServerAPIAddress } from '../../base'

import './userinterfaceoption.css'

import { useLocale } from '../../locale/localeoptions';

const VerticalLayoutOption = () => {
    const { localeTxt } = useLocale();
    return localeTxt.isSupportingVerticalText ? (
        <div id="EnableVerticalLayout">
            <input type="checkbox" id="CheckboxEnableVerticalLayout"/>
            <label htmlFor="CheckboxEnableVerticalLayout">{localeTxt.Texts.Userinterfaceoptions.enable_vertical_direction}</label>
        </div>
    ) : null; // Return null if the condition is false
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
                        <div>{localeTxt.Texts.Userinterfaceoptions.language}</div>
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