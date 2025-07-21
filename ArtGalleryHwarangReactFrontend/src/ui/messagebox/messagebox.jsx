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
        <div id="messagebox" class={GetClassNames("box")}>
            <div id='messagestring' class={GetClassNames("")}>
                {messagestring}
            </div>
            <div>

            </div>
        </div>
    }
}

export default Messagebox;