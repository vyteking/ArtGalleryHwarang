import './messagebox.css'
import Base, { dirClass, GetClassNames } from '../../base'

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

function Messagebox({messagestring, messagetype}) {
    return () => {
        <div id="messagebox" className={GetClassNames("box")}>
            <div id='messagestring' className={GetClassNames("")}>
                {messagestring}
            </div>
            <div>

            </div>
        </div>
    }
}

export default Messagebox;