import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './galleryview.css';
import { GetServerAPIAddress } from '../base';

function PostBar({ post }) {
    return (
        <Link to={`/p/${post.postindex}`}>
            <div id="postbarview">
                <div id="postimage">
                    {/* You might want to have an image URL in your post data */}
                    <img src={"image link here"}  alt={post.posttitle} />
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

function PostGrid({ post }) {
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

function GalleryGridView({origin, page, columns}) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                const postsAddress = GetServerAPIAddress('p', 'api/posts');
                const response = await axios.get(postsAddress);
                setPosts(response.data);
            } catch (err) {
                console.error("Error fetching posts:", err);
                setError("Failed to load posts.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div>Loading posts...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div id="gallerygridview">
            {posts.map((post) => (
                <PostGrid key={post.postindex} post={post} />
            ))}
        </div>
    );
}

function GalleryListView({origin, page}) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                const listorigin = '';
                if (origin === undefined || origin === null) {
                    listorigin = 'api/posts';
                } else {
                    listorigin = 'u:'+{origin,postauthor};
                }
                const postsAddress = GetServerAPIAddress('p', 'api/posts');
                const response = await axios.get(postsAddress);
                setPosts(response.data);
            } catch (err) {
                console.error("Error fetching posts:", err);
                setError("Failed to load posts.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div>Loading posts...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

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