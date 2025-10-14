import { useClassNames } from '../../base';
import './sidebar0.css'

function Sidebar0() {
    const getClassNames = useClassNames();

    return <div id="sidebar0" className={getClassNames("layout")}>
        <ul>
            <li>Main Page</li>
            <li>Hot</li>
            <li>Random User Page</li>
            <li>Random Submission</li>
        </ul>
    </div>
}

export default Sidebar0;