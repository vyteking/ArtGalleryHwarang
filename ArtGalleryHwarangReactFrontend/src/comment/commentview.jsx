import './commentview.css'

function CommentViewer(postindex, commentauthorindex, commentindex) {
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
                            <button>like</button>
                            <button>bookmark</button>
                            <button>add emoji</button>
                        </div>
                        <div>
                            <button>reply</button>
                            <button>edit</button>
                            <button>delete</button>
                            <button>report</button>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    };
}

export default CommentViewer;