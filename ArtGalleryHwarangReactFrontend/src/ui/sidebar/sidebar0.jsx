import { useClassNames } from '../../base';
import { useLocale } from '../../locale/localeoptions';
import { Link, useNavigate } from "react-router-dom";
import './sidebar0.css'

function Sidebar0() {
    const getClassNames = useClassNames();
    const {localeTxt} = useLocale();

    return <div id="sidebar0" className={getClassNames("layout")}>
        <ul id="menulist" className={getClassNames("divide-y")}>
            <Link to="/"><li className={getClassNames("menuitem")}>{localeTxt.sidebar0.mainpage}</li></Link>
            <Link to="/hot"><li className={getClassNames("menuitem")}>{localeTxt.sidebar0.hot}</li></Link>
            <Link to="/u/random"><li className={getClassNames("menuitem")}>{localeTxt.sidebar0.random_user_page}</li></Link>
            <Link to="/p/random"><li className={getClassNames("menuitem")}>{localeTxt.sidebar0.random_submission}</li></Link> 
        </ul>
    </div>
}

export default Sidebar0;