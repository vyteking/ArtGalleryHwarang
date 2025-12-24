import { useClassNames } from '../../base';
import { useLocale } from '../../locale/localeoptions';
import { Link, useNavigate } from "react-router-dom";
import './sidebar0.css'

function Sidebar0({ isVisible }) {
    const getClassNames = useClassNames();
    const {localeTxt} = useLocale();

    const sidebarClasses = `${getClassNames("layout")} ${isVisible ? 'visible' : ''}`;

    return <div id="sidebar0" className={sidebarClasses}>
        <ul id="menulist" className={getClassNames("divide-y")}>
            <Link to="/"><li className={getClassNames("menuitem")}>{localeTxt.sidebar0.mainpage}</li></Link>
            <Link to="/hot"><li className={getClassNames("menuitem")}>{localeTxt.sidebar0.hot}</li></Link>
            <Link to="/u/random"><li className={getClassNames("menuitem")}>{localeTxt.sidebar0.random_user_page}</li></Link>
            <Link to="/p/random"><li className={getClassNames("menuitem")}>{localeTxt.sidebar0.random_submission}</li></Link> 
        </ul>
    </div>
}

export default Sidebar0;