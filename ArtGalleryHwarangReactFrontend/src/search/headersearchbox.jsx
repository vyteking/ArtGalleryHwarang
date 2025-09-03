import './headersearchbox.css'
import { useClassNames } from '../base';

function HeaderSearchBox() {
    const getClassNames = useClassNames();
    return (
        <div id="searchbox" className={getClassNames("layout")}>
            <form id="searchboxform" method="POST">
                <input type="text" id="searchboxinput"/>
                <button type="reset">Reset</button>
                <button type="submit">Search</button>
            </form>
        </div>
    );
}

export default HeaderSearchBox;