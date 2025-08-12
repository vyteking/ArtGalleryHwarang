import Base, { GetClassNames, GetServerAPIAddress } from '../../base'

import './userinterfaceoption.css'

import { useLocale } from '../locale/localeoptions';

const VerticalLayoutOption = () => {
    return theLocale.isSupportingVerticalText ? (
        <tr id="EnableVerticalLayout">
            <td colSpan={2}><input type="checkbox" id="CheckboxEnableVerticalLayout"/>
            <label for="CheckboxEnableVerticalLayout">{localeTxt.Texts.Userinterfaceoptions.enable_vertical_direction}</label></td>
        </tr>
    ) : null; // Return null if the condition is false
};

function Userinterfaceoptionwindow() {
    const { localeTxt } = useLocale();

    const saveUIOption = () => {

    }

    const closeUIOptWin = () => {

    }

    return () => {
        <div id="UIOptionDiv" className='box'>
            <table id="UIOptionTable">
                <tr>
                    <td>{localeTxt.Texts.Userinterfaceoptions.language}</td>
                    <td></td>
                </tr>
                <VerticalLayoutOption />
                <tr>
                    <td><button onClick={saveUIOption}>{localeTxt.Texts.common.OK}</button></td>
                    <td><button onClick={closeUIOptWin}>{localeTxt.Texts.common.Cancel}</button></td>
                </tr>
            </table>
        </div>
    };
}

export default Userinterfaceoptionwindow;