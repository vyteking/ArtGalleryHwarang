import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './postview.css';
import { useClassNames, GetServerAPIAddress } from '../base';
import * as session from '../session';
import { useMessagebox } from '../ui/messagebox/messageboxcontext';

interface PostAuthor {
    username: string;
}

interface Post {
    title: string;
    description: string;
    tags?: string[];
    author?: PostAuthor;
}

interface Reply {
    replyindex: string | number;
    replycontent: string;
    replyauthor: { username?: string };
}

function Reply({ reply }: { reply: Reply }) {
    const getClassNames = useClassNames();

    return (
        <div id="reply" className={getClassNames("")}>
            <p><strong>{reply.replyauthor.username || 'Anonymous'}:</strong></p>
            <p>{reply.replycontent}</p>
        </div>
    );
}

function PostViewer() {
    const { postindex } = useParams<{ postindex: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [replies, setReplies] = useState<Reply[]>([]);
    const [newReply, setNewReply] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const getClassNames = useClassNames();
    const { showMessage } = useMessagebox();

    useEffect(() => {
        if (!postindex) return;

        const fetchPostAndReplies = async () => {
            setLoading(true);
            try {
                const [postResponse, repliesResponse] = await Promise.all([
                    fetch(GetServerAPIAddress('p', `${postindex}`)),
                    fetch(GetServerAPIAddress('r', `posts/${postindex}/replies/`))
                ]);

                if (!postResponse.ok || !repliesResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const postData: Post = await postResponse.json();
                const repliesData: Reply[] = await repliesResponse.json();

                setPost(postData);
                setReplies(repliesData);
            } catch (err) {
                if (import.meta.env.DEV) console.error('Error fetching post:', err);
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchPostAndReplies();
    }, [postindex]);

    const handleReplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newReply.trim()) return;

        try {
            const authToken = session.getAuthToken();
            const response = await fetch(GetServerAPIAddress('r', `posts/${postindex}/replies/`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${authToken}`
                },
                body: JSON.stringify({ replycontent: newReply })
            });

            if (!response.ok) {
                throw new Error('Failed to post reply.');
            }

            const savedReply: Reply = await response.json();
            setReplies([...replies, savedReply]);
            setNewReply('');
        } catch (error) {
            if (import.meta.env.DEV) console.error('Error submitting reply:', error);
            showMessage('Failed to submit reply. Please try again.', 'error');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error)   return <div>Error: {error}</div>;
    if (!post)   return <div>Post not found.</div>;

    return (
        <div id="postviewer" className={getClassNames("layout")}>
            <div id="AuthorInfo" className={getClassNames("")}>
                <div id="AuthorProfile" className={getClassNames("")}>
                    <div id="AuthorProfilePic">pfp</div>
                    <div id="AuthorName">{post.author?.username || 'Unknown Author'}</div>
                </div>
                <div id="AuthorsOtherPosts" className={getClassNames("")}>
                    other posts of the author
                </div>
            </div>
            <div id="PostHeader" className={getClassNames("")}>
                <div id="PreviousPost" className={getClassNames("")}>prev. post</div>
                <div id="PostTitle" className={getClassNames("")}>{post.title}</div>
                <div id="NextPost" className={getClassNames("")}>next post</div>
            </div>
            <div id="PostContents" className={getClassNames("")}>
                context
            </div>
            <div id="PostDescription" className={getClassNames("")}>
                {post.description}
            </div>
            <div id="PostTags" className={getClassNames("")}>
                {post.tags?.join(', ')}
            </div>
            <div id="PostOptions" className={getClassNames("")}>
                <div id="EditPost">edit</div>
                <div id="DeletePost">delete</div>
            </div>

            <div id="PostReplies" className={getClassNames("")}>
                <h3>Replies</h3>
                <div id="replies-list" className={getClassNames("")}>
                    {replies.length > 0 ? (
                        replies.map(reply => <Reply key={reply.replyindex} reply={reply} />)
                    ) : (
                        <p>No replies yet.</p>
                    )}
                </div>
                <form id="reply-form" onSubmit={handleReplySubmit} className={getClassNames("")}>
                    <textarea
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder="Write a reply..."
                        rows={3}
                    />
                    <button type="submit">Submit Reply</button>
                </form>
            </div>
        </div>
    );
}

export default PostViewer;
