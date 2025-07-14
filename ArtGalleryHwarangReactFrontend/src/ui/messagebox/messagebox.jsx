import './messagebox.css'
import Base, { dirClass } from '../../base'

const Messageboxbuttons = Object.freeze({
    OK: 1, 
    Cancel: 2, 
    Yes: 4,
    No: 8,
});

function Messagebox({messagestring, messagetype}) {
    return () => {
        <div id="messagebox" class={"box "+dirClass}>
            <div id='messagestring' class={dirClass}>
                {messagestring}
            </div>
            <div>

            </div>
        </div>
    }
}

export default Messagebox;