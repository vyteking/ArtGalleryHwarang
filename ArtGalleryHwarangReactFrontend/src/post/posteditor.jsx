import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import './posteditor.css';
import { GetServerAPIAddress } from '../base';
import session from '../session.tsx';
import axios from 'axios';

function PostEditor() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [files, setFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [postError, setPostError] = useState(null);

    const { postId } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(postId);

    useEffect(() => {
        if (isEditing) {
            axios.get(GetServerAPIAddress('p', `${postId}`))
                .then(response => {
                    const post = response.data;
                    setTitle(post.title);
                    setDescription(post.description);
                    if (post.tags) {
                        setTags(post.tags.join(', '));
                    }
                    // Note: File fetching for edits is not implemented in this snippet.
                    // You would need a way to get existing files and display them.
                })
                .catch(error => {
                    console.error('Error fetching post:', error);
                    setPostError('Failed to load post data.');
                });
        }
    }, [isEditing, postId]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);

        const newImagePreviews = selectedFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(newImagePreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPostError(null);

        const token = session.getAuthToken();
        if (!token) {
            setPostError('You must be logged in to post.');
            return;
        }

        const formData = new FormData();
        formData.append('posttitle', title);
        formData.append('postdescription', description);
        formData.append('posttag', tags.split(',').map(tag => tag.trim()).filter(tag => tag).join(','));
        files.forEach(file => {
            formData.append('images', file);
        });

        const url = isEditing ? GetServerAPIAddress('p', `${postId}/update`) : GetServerAPIAddress('p', 'api/submit');
        const method = isEditing ? 'put' : 'post';

        try {
            const response = await axios[method](url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
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
        <div className="post-editor-container">
            <h1 className="editor-title">{isEditing ? 'Edit Post' : 'Create New Post'}</h1>
            <form className="post-editor-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title-input">Title</label>
                    <input
                        type="text"
                        id="title-input"
                        className="form-control"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Enter a title"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description-textarea">Description</label>
                    <textarea
                        id="description-textarea"
                        className="form-control"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Tell us about your art"
                        rows="6"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="file-uploader">Upload Images</label>
                    <input
                        type="file"
                        id="file-uploader"
                        className="form-control"
                        onChange={handleFileChange}
                        multiple
                    />
                    <div className="image-previews">
                        {imagePreviews.map((preview, index) => (
                            <img key={index} src={preview} alt={`Preview ${index + 1}`} className="image-preview" />
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="tag-input">Tags</label>
                    <input
                        type="text"
                        id="tag-input"
                        className="form-control"
                        value={tags}
                        onChange={e => setTags(e.target.value)}
                        placeholder="e.g., painting, abstract, modern"
                    />
                </div>

                {postError && <div className="error-message">{postError}</div>}

                <div className="form-actions">
                    <button id="submit-button" className="btn btn-primary" type="submit">{isEditing ? 'Update Post' : 'Create Post'}</button>
                    <button id="cancel-button" className="btn btn-secondary" type="button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default PostEditor;
