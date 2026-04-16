import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './galleryview.css';
import { GetServerAPIAddress } from '../base';

interface Post {
    postindex: string | number;
    posttitle: string;
    postauthor: string | number;
    postdate: string;
}

interface GalleryGridViewProps {
    origin?: string;
    page?: number;
    columns?: number;
}

interface GalleryListViewProps {
    origin?: string;
    page?: number;
}

function PostBar({ post }: { post: Post }) {
    return (
        <Link to={`/p/${post.postindex}`}>
            <div id="postbarview">
                <div id="postimage">
                    <img src={"image link here"} alt={post.posttitle} />
                </div>
                <div id="postoption">
                    <Link to={`/u/${post.postauthor}`}>
                        <div id="postauthoricon">author</div>
                    </Link>
                    <Link to={`/p/${post.postindex}`}>
                        <div id="posttitle">{post.posttitle}</div>
                    </Link>
                    <div id="postdate">{post.postdate}</div>
                    <Link to={`/p/${post.postindex}/givelike`}>
                        <div id="postlike">like</div>
                    </Link>
                </div>
            </div>
        </Link>
    );
}

function PostGrid({ post }: { post: Post }) {
    return (
        <Link to={`/p/${post.postindex}`}>
            <div id="postgridview">
                <div id="postimage">
                    <img src={"image link here"} alt={post.posttitle} />
                </div>
                <div id="postoption">
                    <Link to={`/u/${post.postauthor}`}>
                        <div id="postauthoricon">author</div>
                    </Link>
                    <Link to={`/p/${post.postindex}`}>
                        <div id="posttitle">{post.posttitle}</div>
                    </Link>
                    <Link to={`/p/${post.postindex}/givelike`}>
                        <div id="postlike">like</div>
                    </Link>
                </div>
            </div>
        </Link>
    );
}

function GalleryGridView({ origin, page, columns }: GalleryGridViewProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                const postsAddress = GetServerAPIAddress('p', 'api/posts');
                const response = await axios.get<Post[]>(postsAddress);
                setPosts(response.data);
            } catch (err) {
                if (import.meta.env.DEV) console.error('Error fetching posts:', err);
                setError('Failed to load posts.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return <div>Loading posts...</div>;
    if (error)   return <div>Error: {error}</div>;

    return (
        <div id="gallerygridview">
            {posts.map((post) => (
                <PostGrid key={post.postindex} post={post} />
            ))}
        </div>
    );
}

function GalleryListView({ origin, page }: GalleryListViewProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                const postsAddress = GetServerAPIAddress('p', 'api/posts');
                const response = await axios.get<Post[]>(postsAddress);
                setPosts(response.data);
            } catch (err) {
                if (import.meta.env.DEV) console.error('Error fetching posts:', err);
                setError('Failed to load posts.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return <div>Loading posts...</div>;
    if (error)   return <div>Error: {error}</div>;

    return (
        <div id="gallerylistview">
            {posts.map((post) => (
                <PostBar key={post.postindex} post={post} />
            ))}
        </div>
    );
}

export default {
    GalleryGridView,
    GalleryListView,
};
