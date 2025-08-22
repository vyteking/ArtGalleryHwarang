import { useState, useEffect } from 'react';
import './postview.css';
import { GetClassNames } from '../base';

// A component to display a single reply
function Reply({ reply }) {
    return (
        <div className="reply">
            <p><strong>{reply.replyauthor.username || 'Anonymous'}:</strong></p>
            <p>{reply.replycontent}</p>
        </div>
    );
}

function PostViewer({ postindex }) {
    const [post, setPost] = useState(null);
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!postindex) return;

        const fetchPostAndReplies = async () => {
            setLoading(true);
            try {
                // Fetch post and replies concurrently
                const [postResponse, repliesResponse] = await Promise.all([
                    fetch(`/api/p/${postindex}/`), // Assuming this is your post detail endpoint
                    fetch(`/api/r/posts/${postindex}/replies/`)
                ]);

                if (!postResponse.ok || !repliesResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const postData = await postResponse.json();
                const repliesData = await repliesResponse.json();

                setPost(postData);
                setReplies(repliesData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPostAndReplies();
    }, [postindex]);

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!newReply.trim()) return;

        try {
            // This is a placeholder for your auth token
            const authToken = localStorage.getItem('authToken'); 

            const response = await fetch(`/api/r/posts/${postindex}/replies/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // You need to implement how you get your auth token
                    'Authorization': `Token ${authToken}` 
                },
                body: JSON.stringify({ replycontent: newReply })
            });

            if (!response.ok) {
                throw new Error('Failed to post reply.');
            }

            const savedReply = await response.json();
            setReplies([...replies, savedReply]); // Add new reply to the list
            setNewReply(''); // Clear the input
        } catch (error) {
            console.error("Error submitting reply:", error);
            // You might want to show an error message to the user
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!post) return <div>Post not found.</div>;

    return (
        <div id="postviewer" className={GetClassNames("layout")}>
            <div id="AuthorInfo" className={GetClassNames()}>
                <div id="AuthorProfile" className={GetClassNames()}>
                    <div id="AuthorProfilePic">pfp</div>
                    {/* Assuming post.author has a username field */}
                    <div id="AuthorName">{post.author?.username || 'Unknown Author'}</div>
                </div>
                <div id="AuthorsOtherPosts" className={GetClassNames()}>
                    other posts of the author
                </div>
            </div>
            <div id="PostHeader" className={GetClassNames()}>
                <div id="PreviousPost" className={GetClassNames()}>prev. post</div>
                <div id="PostTitle" className={GetClassNames()}>{post.title}</div>
                <div id="NextPost" className={GetClassNames()}>next post</div>
            </div>
            <div id="PostContents" className={GetClassNames()}>
                {/* You'll need to handle rendering different content types here */}
                context
            </div>
            <div id="PostDescription" className={GetClassNames()}>
                {post.description}
            </div>
            <div id="PostTags" className={GetClassNames()}>
                {post.tags?.join(', ')}
            </div>
            <div id="PostOptions" className={GetClassNames()}>
                <div id="EditPost">edit</div>
                <div id="DeletePost">delete</div>
            </div>
            
            {/* Replies Section */}
            <div id="PostReplies" className={GetClassNames()}>
                <h3>Replies</h3>
                <div className="replies-list">
                    {replies.length > 0 ? (
                        replies.map(reply => <Reply key={reply.replyindex} reply={reply} />)
                    ) : (
                        <p>No replies yet.</p>
                    )}
                </div>
                <form onSubmit={handleReplySubmit} className="reply-form">
                    <textarea
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder="Write a reply..."
                        rows="3"
                    />
                    <button type="submit">Submit Reply</button>
                </form>
            </div>
        </div>
    );
}

export default PostViewer;
