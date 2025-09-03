import './commentview.css'

import Base, { useClassNames } from '../base'

function CommentViewer({postindex, commentauthorindex, commentindex}) {
    const getClassNames = useClassNames();
    return (
        <div id="commentviewer" className={getClassNames("")}>
            <div id="authorinfo" className={getClassNames("")}>
                <div id="authoricon">authoricon</div>
                <div id="authorname">authorname</div>
            </div>
            <div id="commentbox">
                <div id="commentcontext">
                    commentcontext
                </div>
                <div id="commentoptions">
                    <div id="commentreactions">
                        <button id="btn_Like">like</button>
                        <button id="btn_Bookmark">bookmark</button>
                        <button id="btn_AddEmoji">add emoji</button>
                    </div>
                    <div id="commenteditbuttons">
                        <button id="btn_Reply">reply</button>
                        <button id="btn_Edit">edit</button>
                        <button id="btn_Delete">delete</button>
                        <button id="btn_Report">report</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommentViewer;