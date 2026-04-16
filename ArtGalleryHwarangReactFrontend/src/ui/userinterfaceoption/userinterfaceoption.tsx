import { useClassNames } from '../../base';
import './userinterfaceoption.css';

import { useLocale } from '../../locale/localeoptions';
import { useTheme } from '../../theme/themeoptions';
import type { ThemeName } from '../../theme/themeoptions';
import { useOrientation } from '../orientation/OrientationContext';
import { isSupportingVerticalText } from '../orientation/orientationoptions';

function VerticalLayoutOption() {
    const { direction, localeTxt } = useLocale();
    const { isVertical, toggleVertical } = useOrientation();

    if (!isSupportingVerticalText(direction)) {
        return null;
    }

    return (
        <div className="ui-option-checkbox-row">
            <input
                type="checkbox"
                id="CheckboxEnableVerticalLayout"
                checked={isVertical}
                onChange={toggleVertical}
            />
            <label htmlFor="CheckboxEnableVerticalLayout">
                {localeTxt.userinterfaceoptions.enable_vertical_direction}
            </label>
        </div>
    );
}

interface UserinterfaceoptionwindowProps {
    toggleVisibility: () => void;
}

function Userinterfaceoptionwindow({ toggleVisibility }: UserinterfaceoptionwindowProps) {
    const { localeTxt, locales, currentLocale, setLocale } = useLocale();
    const { theme, toggleTheme } = useTheme();
    const getClassNames = useClassNames();

    return (
        <div id="UIOptionDiv" className={getClassNames('ui-option-overlay')}>
            <div id="UIOptionTable" className={getClassNames('ui-option-panel')}>
                <div className="ui-option-row">
                    <span className="ui-option-label">{localeTxt.userinterfaceoptions.language}</span>
                    <select
                        value={currentLocale.LocaleInfo.code}
                        onChange={e => setLocale(e.target.value)}
                    >
                        {[...locales.entries()].map(([code, name]) => (
                            <option key={code} value={code}>{name}</option>
                        ))}
                    </select>
                </div>
                <VerticalLayoutOption />
                <div className="ui-option-row">
                    <span className="ui-option-label">{localeTxt.userinterfaceoptions.theme}</span>
                    <select
                        value={theme}
                        onChange={e => { if (e.target.value !== theme) toggleTheme(); }}
                    >
                        <option value="bright-white">{localeTxt.userinterfaceoptions.theme_light}</option>
                        <option value="darky-black">{localeTxt.userinterfaceoptions.theme_dark}</option>
                    </select>
                </div>
                <div className="ui-option-actions">
                    <button className={getClassNames('btn-secondary')} onClick={toggleVisibility}>
                        {localeTxt.common.Cancel}
                    </button>
                    <button className={getClassNames('btn-primary')} onClick={toggleVisibility}>
                        {localeTxt.common.OK_Confirm_btn}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Userinterfaceoptionwindow;
