import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import './posteditor.css'
import { useClassNames, GetServerAPIAddress } from '../base';
import GetCurrentLoginSession from '../session.tsx'
import session from '../session.tsx';

import axios from 'axios'

function PostEditor() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [postError, setPostError] = useState(null);
    const getClassNames = useClassNames();
    // const postUser = GetCurrentLoginSession();

    const { postId } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(postId);

    useEffect(() => {
        if (isEditing) {
            axios.get(`/api/post/${postId}/`)
                .then(response => {
                    const post = response.data;
                    setTitle(post.title);
                    setDescription(post.description);
                    if (post.tags) {
                        setTags(post.tags.join(', '));
                    }
                })
                .catch(error => {
                    console.error('Error fetching post:', error);
                    setPostError('Failed to load post data.');
                });
        }
    }, [isEditing, postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPostError(null);

        const token = session.getAuthToken();
        if (!token) {
            setPostError('You must be logged in to post.');
            return;
        }

        const postData = {
            posttitle: title,
            postdescription: description,
            posttag: tags.split(',').map(tag => tag.trim()).filter(tag => tag).join(','),
        };

        const url = isEditing ? GetServerAPIAddress('p', `${postId}/update`) : GetServerAPIAddress('p', 'api/submit');
        const method = isEditing ? 'put' : 'post';

        try {
            const response = await axios[method](url, postData, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            navigate(`/post/${response.data.id}`);
        } catch (error) {
            console.error('Error submitting post:', error);
            setPostError('Failed to submit post.');
        }
    };

    const handleCancel = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <div id="posteditor" className={getClassNames("layout")}>
            <form id="posteditorform" method="POST" onSubmit={handleSubmit}>
                <div id="posttitle" className={""}>
                    <input
                        type="text"
                        id="titleinput"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Title"
                        required
                    />
                </div>
                <div id="contextuploader">
                    <input type="file" id="fileuploader" multiple/>
                </div> {/* */}
                <div id="postdescription">
                    <textarea
                        id="descriptiontextarea"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Description"
                        required
                    />
                </div>
                <div id="posttags">
                    <input
                        type="text"
                        id="taginput"
                        value={tags}
                        onChange={e => setTags(e.target.value)}
                        placeholder="Tags, separated by commas"
                    />
                </div>
                <div>
                    <div id="postoptions">
                        <button id="submitbutton" type="submit">{isEditing ? 'Update Post' : 'Create Post'}</button>
                        <button id="cancelbutton" type="button" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
                {postError && <div className="error-message">{postError}</div>}
            </form>
        </div>
    );
}

export default PostEditor;