import './messagebox.css'
import Base, { useClassNames } from '../../base'
import { useMessagebox } from './messageboxcontext';

const Messageboxbuttons = Object.freeze({
    OK: 1, 
    Cancel: 2, 
    Yes: 4,
    No: 8,
    Close: 16,
    Retry: 32,
    Ignore: 64,
    Save: 128,
    Add: 256,
    Modify: 512,
    Delete: 1024,
});

function Messagebox() {
    const getClassNames = useClassNames();
    const { messagebox, hideMessage } = useMessagebox();

    if (!messagebox.isOpen) {
        return null;
    }

    return (
        <div id="messagebox" className={getClassNames("box")}>
            <div id='messagestring' className={getClassNames("")}>
                {messagebox.message}
            </div>
            <div>
                <button onClick={hideMessage}>Close</button>
            </div>
        </div>
    );
}

export default Messagebox;