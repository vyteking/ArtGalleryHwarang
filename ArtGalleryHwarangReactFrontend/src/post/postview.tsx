import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './postview.css';
import { useClassNames, GetServerAPIAddress } from '../base';
import * as session from '../session';
import { useMessagebox } from '../ui/messagebox/messageboxcontext';
import { useLang } from '../locale/localetextgetter';

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

function ReplyItem({ reply }: { reply: Reply }) {
    const getClassNames = useClassNames();
    const t = useLang('replieslist');

    return (
        <div className={getClassNames('reply-item card')}>
            <div className="reply-author">
                <div className="reply-avatar">
                    {(reply.replyauthor.username?.[0] ?? t.anonymous[0]).toUpperCase()}
                </div>
                <strong className="reply-username">
                    {reply.replyauthor.username || t.anonymous}
                </strong>
            </div>
            <p className="reply-content">{reply.replycontent}</p>
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
    const tv = useLang('postview');
    const tr = useLang('replieslist');

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

            if (!response.ok) throw new Error('Failed to post reply.');

            const savedReply: Reply = await response.json();
            setReplies([...replies, savedReply]);
            setNewReply('');
        } catch (error) {
            if (import.meta.env.DEV) console.error('Error submitting reply:', error);
            showMessage('Failed to submit reply. Please try again.', 'error');
        }
    };

    if (loading) return (
        <div className={getClassNames('postview-state')}>
            <div className="postview-spinner" />
            <p>{tv.loading_post}</p>
        </div>
    );
    if (error) return (
        <div className={getClassNames('postview-state')}>
            <p className="error-message">{tv.post_error}: {error}</p>
        </div>
    );
    if (!post) return (
        <div className={getClassNames('postview-state')}>
            <p>{tv.post_not_found}</p>
        </div>
    );

    return (
        <div id="postviewer" className={getClassNames('layout')}>

            <aside id="AuthorInfo" className={getClassNames('card author-info')}>
                <div id="AuthorProfile" className="author-profile">
                    <div id="AuthorProfilePic" className="author-avatar">
                        {(post.author?.username?.[0] ?? '?').toUpperCase()}
                    </div>
                    <div id="AuthorName" className="author-name">
                        {post.author?.username || tv.unknown_author}
                    </div>
                </div>
                <hr className="divider" />
                <div id="AuthorsOtherPosts" className="author-other-posts">
                    <p className="section-label">{tv.more_from_artist}</p>
                </div>
            </aside>

            <main className="post-main">
                <nav id="PostHeader" className={getClassNames('post-header')}>
                    <button id="PreviousPost" className="btn-ghost post-nav-btn">{tv.prev_post}</button>
                    <h1 id="PostTitle" className="post-title">{post.title}</h1>
                    <button id="NextPost" className="btn-ghost post-nav-btn">{tv.next_post}</button>
                </nav>

                <section id="PostContents" className={getClassNames('card post-contents')}>
                    <p className="post-contents-placeholder">{tv.post_contents_placeholder}</p>
                </section>

                <section id="PostDescription" className={getClassNames('post-description')}>
                    {post.description}
                </section>

                {post.tags && post.tags.length > 0 && (
                    <div id="PostTags" className="post-tags">
                        {post.tags.map(tag => (
                            <span key={tag} className={getClassNames('post-tag')}>#{tag}</span>
                        ))}
                    </div>
                )}

                <div id="PostOptions" className="post-options">
                    <button className="btn-secondary">{tv.btn_Modify}</button>
                    <button className="btn-danger">{tv.btn_Delete}</button>
                </div>

                <section id="PostReplies" className={getClassNames('post-replies')}>
                    <h3 className="replies-heading">
                        {tr.lbl_Replies} <span className="replies-count">{replies.length}</span>
                    </h3>

                    <div id="replies-list" className="replies-list">
                        {replies.length > 0 ? (
                            replies.map(reply => <ReplyItem key={reply.replyindex} reply={reply} />)
                        ) : (
                            <p className="replies-empty">{tr.no_replies}</p>
                        )}
                    </div>

                    <form id="reply-form" onSubmit={handleReplySubmit} className="reply-form">
                        <textarea
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            placeholder={tr.tbx_reply_Placeholder}
                            rows={3}
                        />
                        <div className="reply-form-actions">
                            <button type="submit" className="btn-primary">{tr.btn_submit_reply}</button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}

export default PostViewer;
