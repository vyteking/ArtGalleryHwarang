import { useClassNames } from '../../base';
import './sidebar1.css';

function Sidebar1() {
    const getClassNames = useClassNames();

    return (
        <div id="sidebar1" className={getClassNames('layout')}>
        </div>
    );
}

export default Sidebar1;
