import './postview.css'

import { GetClassNames } from "../base";

function PostViewer(postindex) {
    return () => {
        <div id="postviewer" className={GetClassNames("layout")}>
            <div className={GetClassNames()}>
                <div className={GetClassNames()}>
                    <div>pfp</div>
                    <div>authorname</div>
                </div>
                <div className={GetClassNames()}>
                    other posts of the author
                </div>
            </div>
            <div className={GetClassNames()}>
                <div>prev. post</div>
                <div>post title</div>
                <div>next post</div>
            </div>
            <div>
                context
            </div>
            <div>
                description
            </div>
            <div>
                tags
            </div>
            <div>
                <div id="postreactions">
                    <div>likes</div>
                    <div>replies</div>
                </div>
                <div id="postoptions">
                    <div>edit</div>
                    <div>delete</div>
                </div>
            </div>
        </div>
    };
}

export default PostViewer;