import './commentview.css'

import Base, { dirClass } from '../base'

function CommentViewer(postindex, commentauthorindex, commentindex) {
    return () => {
        <div id="commentviewer" className={dirClass}>
            <div id="authorinfo" className={dirClass}>
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
    };
}

export default CommentViewer;