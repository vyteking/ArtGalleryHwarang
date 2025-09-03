import './commentview.css'
import './commenteditor.css'

import Base, { useClassNames } from '../base'

function CommentEditor({postindex, commentauthorindex, commentindex}) {
    const getClassNames = useClassNames();
    return (
        <div id="commentviewer" className={getClassNames("")}>
            <div id="authorinfo" className={getClassNames("")}>
                <div id="authoricon">authoricon</div>
                <div id="authorname">authorname</div>
            </div>
            <div id="commentbox">
                <div id="commentcontext">
                    <textarea id="commentinputcontext">
                        commentcontext
                    </textarea>
                </div>
                <div id="commentoptions">
                    <div id="commenteditbuttons">
                        <button id="btn_Reset">reset</button>
                        <button id="btn_Edit">edit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommentEditor;