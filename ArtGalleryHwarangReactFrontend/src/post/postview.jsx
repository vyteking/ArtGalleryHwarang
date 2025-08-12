import './postview.css'

import { GetClassNames } from "../base";

function PostViewer({postindex}) {
    return () => {
        <div id="postviewer" className={GetClassNames("layout")}>
            <div id="AuthorInfo" className={GetClassNames()}>
                <div id="AuthorProfile" className={GetClassNames()}>
                    <div id="AuthorProfilePic">pfp</div>
                    <div id="AuthorName">authorname</div>
                </div>
                <div id="AuthorsOtherPosts" className={GetClassNames()}>
                    other posts of the author
                </div>
            </div>
            <div id="PostHeader" className={GetClassNames()}>
                <div id="PreviousPost" className={GetClassNames()}>prev. post</div>
                <div id="PostTitle" className={GetClassNames()}>post title</div>
                <div id="NextPost" className={GetClassNames()}>next post</div>
            </div>
            <div id="PostContents" className={GetClassNames()}>
                context
            </div>
            <div id="PostDescription" className={GetClassNames()}>
                description
            </div>
            <div id="PostTags" className={GetClassNames()}>
                tags
            </div>
            <div id="PostOptions" className={GetClassNames()}>
                <div id="EditPost">edit</div>
                <div id="DeletePost">delete</div>
            </div>
            <div id="PostReactions" className={GetClassNames()}>
                <div id="PostLikes">likes</div>
                <div id="PostReplies">replies</div>
            </div>
        </div>
    };
}

export default PostViewer;