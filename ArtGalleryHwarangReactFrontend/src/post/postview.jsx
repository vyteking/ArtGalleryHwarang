function PostViewer(postindex) {
    return () => {
        <div>
            <div>
                <div>
                    <div>pfp</div>
                    <div>authorname</div>
                </div>
                <div>
                    other posts of the author
                </div>
            </div>
            <div>
                <div>prev. post</div>
                <div>post title</div>
                <div>next post</div>
            </div>
            <div></div>
        </div>
    };
}

export default PostViewer;