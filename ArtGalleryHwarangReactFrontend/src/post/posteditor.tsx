import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './posteditor.css';
import { GetServerAPIAddress, useClassNames } from '../base';
import * as session from '../session';
import { useMessagebox } from '../ui/messagebox/messageboxcontext';
import { useLang } from '../locale/localetextgetter';
import axios from 'axios';

interface PostData {
    title: string;
    description: string;
    tags?: string[];
}

interface FilePreview {
    file: File;
    url: string;
}

function PostEditor() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [postError, setPostError] = useState<string | null>(null);

    const getClassNames = useClassNames();
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const { showMessage } = useMessagebox();
    const t = useLang('posteditor');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isEditing = Boolean(postId);

    useEffect(() => {
        if (isEditing) {
            axios.get<PostData>(GetServerAPIAddress('p', `${postId}`))
                .then(response => {
                    const post = response.data;
                    setTitle(post.title);
                    setDescription(post.description);
                    if (post.tags) setTags(post.tags);
                })
                .catch((error) => {
                    if (import.meta.env.DEV) console.error('Error fetching post:', error);
                    setPostError(t.error_load_failed);
                });
        }
    }, [isEditing, postId]);

    useEffect(() => {
        return () => {
            filePreviews.forEach(fp => URL.revokeObjectURL(fp.url));
        };
    }, [filePreviews]);

    const addFiles = (incoming: File[]) => {
        const newPreviews = incoming.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));
        setFilePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeFile = (index: number) => {
        setFilePreviews(prev => {
            URL.revokeObjectURL(prev[index].url);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        addFiles(Array.from(e.target.files ?? []));
        e.target.value = '';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        addFiles(Array.from(e.dataTransfer.files));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ',' || e.key === 'Enter') {
            e.preventDefault();
            const trimmed = tagInput.trim().replace(/,+$/, '');
            if (trimmed && !tags.includes(trimmed)) {
                setTags(prev => [...prev, trimmed]);
            }
            setTagInput('');
        } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
            setTags(prev => prev.slice(0, -1));
        }
    };

    const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPostError(null);

        const token = session.getAuthToken();
        if (!token) {
            setPostError(t.error_login_required);
            return;
        }

        const formData = new FormData();
        formData.append('posttitle', title);
        formData.append('postdescription', description);
        formData.append('posttag', tags.join(','));
        filePreviews.forEach(fp => formData.append('images', fp.file));

        const url = isEditing
            ? GetServerAPIAddress('p', `${postId}/update`)
            : GetServerAPIAddress('p', 'api/submit');
        const method = isEditing ? 'put' : 'post';

        try {
            const response = await axios[method](url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Token ${token}`
                }
            });
            navigate(`/p/${response.data.id}`);
        } catch (error) {
            if (import.meta.env.DEV) console.error('Error submitting post:', error);
            setPostError(t.error_submit_failed);
            showMessage(t.error_submit_failed, 'error');
        }
    };

    return (
        <div className={getClassNames('post-editor-container')}>
            <h1 className="editor-title">{isEditing ? t.scr_EditPost : t.lbl_title}</h1>

            <form className="post-editor-form" onSubmit={handleSubmit}>

                <div className="form-group">
                    <label htmlFor="title-input">{t.lbl_post_title}</label>
                    <input
                        type="text"
                        id="title-input"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder={t.tbx_title_Placeholder}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description-textarea">{t.lbl_description}</label>
                    <textarea
                        id="description-textarea"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder={t.txt_description_Placeholder}
                        rows={6}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>{t.lbl_uploadfile}</label>
                    <div
                        className={`file-drop-zone${isDragging ? ' dragging' : ''}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                    >
                        <span className="file-drop-icon">↑</span>
                        <span className="file-drop-label">
                            {isDragging ? 'Drop files here' : 'Click or drag files here'}
                        </span>
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileChange}
                            multiple
                            hidden
                        />
                    </div>

                    {filePreviews.length > 0 && (
                        <div className="image-previews">
                            {filePreviews.map((fp, index) => (
                                <div key={index} className="image-preview-wrapper">
                                    <img src={fp.url} alt={`Preview ${index + 1}`} className="image-preview" />
                                    <button
                                        type="button"
                                        className="image-remove-btn"
                                        onClick={() => removeFile(index)}
                                        aria-label="Remove file"
                                    >×</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="tag-input">{t.lbl_tags}</label>
                    <div className={getClassNames('tag-input-box')}>
                        {tags.map(tag => (
                            <span key={tag} className={getClassNames('editor-tag')}>
                                #{tag}
                                <button type="button" className="tag-remove-btn" onClick={() => removeTag(tag)}>×</button>
                            </span>
                        ))}
                        <input
                            id="tag-input"
                            type="text"
                            className="tag-text-input"
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder={tags.length === 0 ? t.tbx_tags_Placeholder : ''}
                        />
                    </div>
                </div>

                {postError && <div className="error-message">{postError}</div>}

                <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
                        {t.btn_Cancel}
                    </button>
                    <button type="submit" className="btn-primary">
                        {isEditing ? t.btn_Update : t.btn_Submit}
                    </button>
                </div>

            </form>
        </div>
    );
}

export default PostEditor;
