import './commenteditor.css'

import Base, { dirClass } from '../base'

function CommentEditor(postindex, commentauthorindex, commentindex) {
    return () => {
        <div>
            <table>
                <tr>
                    <td>authoricon</td>
                    <td>
                        <div>
                            commentcontext
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>authorname</td>
                    <td>
                        <div>
                            <button>addcomment</button>
                            <button>clearcomment</button>
                            <button>cancel</button>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    };
}

export default CommentEditor;