import { useClassNames } from '../../base';
import { useLocale } from '../../locale/localeoptions';
import { Link, useNavigate } from "react-router-dom";
import './sidebar1.css'

function Sidebar1() {
    const getClassNames = useClassNames();
    const {localeTxt} = useLocale();

    return <div id="sidebar1" className={getClassNames("layout")}>

    </div>
}

export default Sidebar1;