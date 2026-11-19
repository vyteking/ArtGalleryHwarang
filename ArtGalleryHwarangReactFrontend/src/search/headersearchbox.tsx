import './headersearchbox.css';
import { useClassNames } from '../base';
import { useLang } from '../locale/localetextgetter';

function HeaderSearchBox() {
    const getClassNames = useClassNames();
    const lang = useLang('search');
    return (
        <div id="searchbox" className={getClassNames("layout")}>
            <form id="searchboxform" method="POST">
                <input type="text" id="searchboxinput" placeholder={lang.tbx_search_Placeholder} aria-label={lang.btn_search} />
                <button type="reset">{lang.btn_reset}</button>
                <button type="submit">{lang.btn_search}</button>
            </form>
        </div>
    );
}

export default HeaderSearchBox;
