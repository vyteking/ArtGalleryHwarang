import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './postview.css';
import { useClassNames, GetServerAPIAddress } from '../base';
import * as session from '../session';
import { useMessagebox } from '../ui/messagebox/messageboxcontext';
import { useLang } from '../locale/localetextgetter';
import axios from 'axios';

interface PostAuthor {
    user_index_1st: string;
    username: string;
}

interface Post {
    title: string;
    description: string;
    tags: string[];
    author?: PostAuthor;
    prev_postindex: string | null;
    next_postindex: string | null;
}

interface Image2D {
    imagefile: string;
    description: string;
}

interface BlogContent {
    blogcontext: string;
}

interface Object3D {
    objectfile: string;
    description: string;
}

interface PostContent {
    postcontentindex: string;
    image2d: Image2D[];
    blogcontent: BlogContent[];
    object3d: Object3D[];
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
    const navigate = useNavigate();

    const { postindex } = useParams<{ postindex: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [postContents, setPostContents] = useState<PostContent[]>([]);
    const [replies, setReplies] = useState<Reply[]>([]);
    const [newReply, setNewReply] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getClassNames = useClassNames();
    const { showMessage, showConfirm } = useMessagebox();
    
    const tv = useLang('postview');
    const tr = useLang('replieslist');

    useEffect(() => {
        if (!postindex) return;

        const fetchPostAndReplies = async () => {
            setLoading(true);
            try {
                const [postResponse, repliesResponse] = await Promise.all([
                    axios.get<Post>(GetServerAPIAddress('p', `${postindex}`)),
                    axios.get<Reply[]>(GetServerAPIAddress('r', `posts/${postindex}/replies/`))
                ]);
                setPost(postResponse.data);
                setReplies(repliesResponse.data);

                const contentsResponse = await axios.get<PostContent[]>(
                    GetServerAPIAddress('c', `posts/${postindex}/`)
                );
                setPostContents(contentsResponse.data);
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
            const response = await axios.post<Reply>(
                GetServerAPIAddress('r', `posts/${postindex}/replies/`),
                { replycontent: newReply },
                { headers: { Authorization: `Token ${authToken}` } }
            );
            setReplies([...replies, response.data]);
            setNewReply('');
        } catch (error) {
            if (import.meta.env.DEV) console.error('Error submitting reply:', error);
            showMessage('Failed to submit reply. Please try again.', 'error');
        }
    };

    const handleDelete = async () => {
        if (!await showConfirm(tv.confirm_delete, 'warning')) return;
        try {
            const authToken = session.getAuthToken();
            await axios.delete(GetServerAPIAddress('p', `${postindex}/delete`), { // URL은 백엔드에 맞게 수정
                headers: { Authorization: `Token ${authToken}` }
            });
            navigate('/'); // 삭제 후 목록으로 이동
        } catch (err) {
            showMessage('Delete failed', 'error');
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
            {/*<div id="PostOptions" className="post-options">
                <button className="btn-secondary" onClick={() => navigate(`/p/${postindex}/edit`)}>
                    {tv.btn_Modify}
                </button>
                <button className="btn-danger" onClick={handleDelete}>
                    {tv.btn_Delete}
                </button>
            </div>*/}
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
                    <button
                        id="PreviousPost"
                        className="btn-ghost post-nav-btn"
                        onClick={() => post.prev_postindex && navigate(`/p/${post.prev_postindex}`)}
                        disabled={!post.prev_postindex}
                    >{tv.prev_post}</button>
                    <h1 id="PostTitle" className="post-title">{post.title}</h1>
                    <button
                        id="NextPost"
                        className="btn-ghost post-nav-btn"
                        onClick={() => post.next_postindex && navigate(`/p/${post.next_postindex}`)}
                        disabled={!post.next_postindex}
                    >{tv.next_post}</button>
                </nav>

                <section id="PostContents" className={getClassNames('card post-contents')}>
                    {postContents.length === 0 ? (
                        <p className="post-contents-placeholder">{tv.post_contents_placeholder}</p>
                    ) : (
                        postContents.map(content => (
                            <div key={content.postcontentindex} className="post-content-item">
                                {content.blogcontent.map((b, i) => (
                                    <p key={i} className="post-blog-content">{b.blogcontext}</p>
                                ))}
                                {content.image2d.map((img, i) => (
                                    <img key={i} src={img.imagefile} alt={img.description} className="post-image" />
                                ))}
                                {content.object3d.map((obj, i) => (
                                    <a key={i} href={obj.objectfile} className="post-object3d-link" download>{obj.description || obj.objectfile}</a>
                                ))}
                            </div>
                        ))
                    )}
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

                {String(session.GetCurrentLoginSession()?.user_index_1st) === post.author?.user_index_1st && (
                    <div id="PostOptions" className="post-options">
                        <button className="btn-secondary" onClick={() => navigate(`/p/${postindex}/edit`)}>{tv.btn_Modify}</button>
                        <button className="btn-danger" onClick={handleDelete}>{tv.btn_Delete}</button>
                    </div>
                )}

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
