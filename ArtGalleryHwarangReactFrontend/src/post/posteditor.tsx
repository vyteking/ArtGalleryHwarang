import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './posteditor.css';
import { GetServerAPIAddress, useClassNames } from '../base';
import { api, idSegment, isCancelled } from '../api';
import { useSession } from '../SessionProvider';
import { useMessagebox } from '../ui/messagebox/messageboxcontext';
import { useLang } from '../locale/localetextgetter';

// Only image uploads exist so far. SVG is excluded because it can carry scripts.
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;
const isAllowedImage = (file: File) => file.type.startsWith('image/') && file.type !== 'image/svg+xml';

interface PostData {
    title: string;
    description: string;
    tags: string[];
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
    const [submitting, setSubmitting] = useState(false);

    const getClassNames = useClassNames();
    const { postindex: postId } = useParams<{ postindex: string }>();
    const navigate = useNavigate();
    const { showMessage } = useMessagebox();
    const { currentUser } = useSession();
    const t = useLang('posteditor');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const previewsRef = useRef<FilePreview[]>([]);
    // Set once a new post exists, so retrying after a failed upload updates it instead of creating another.
    const createdPostRef = useRef<string | null>(null);
    // State only updates on the next render, which is too late to stop a second click right after the first.
    const submitLockRef = useRef(false);
    const isEditing = Boolean(postId);

    useEffect(() => {
        if (!isEditing) return;
        const controller = new AbortController();

        const fetchPost = async () => {
            try {
                const response = await api.get<PostData>(
                    GetServerAPIAddress('p', idSegment(postId)), { signal: controller.signal });
                const post = response.data;
                setTitle(post.title);
                setDescription(post.description);
                setTags(post.tags ?? []);
            } catch (error) {
                if (isCancelled(error)) return;
                if (import.meta.env.DEV) console.error('Error fetching post:', error);
                setPostError(t.error_load_failed);
            }
        };

        fetchPost();
        return () => controller.abort();
    }, [isEditing, postId]);

    useEffect(() => {
        previewsRef.current = filePreviews;
    }, [filePreviews]);

    // Release the remaining preview URLs only when leaving the page. Files removed earlier are released as they go.
    useEffect(() => {
        return () => {
            previewsRef.current.forEach(fp => URL.revokeObjectURL(fp.url));
        };
    }, []);

    const addFiles = (incoming: File[]) => {
        if (incoming.some(file => !isAllowedImage(file))) {
            showMessage(t.error_invalid_file_type, 'error');
        } else if (incoming.some(file => file.size > MAX_FILE_SIZE_BYTES)) {
            showMessage(t.error_file_too_large, 'error');
        }
        const newPreviews = incoming
            .filter(file => isAllowedImage(file) && file.size <= MAX_FILE_SIZE_BYTES)
            .map(file => ({
                file,
                url: URL.createObjectURL(file)
            }));
        setFilePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeFile = (target: FilePreview) => {
        URL.revokeObjectURL(target.url);
        setFilePreviews(prev => prev.filter(fp => fp !== target));
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

    // Upload all images at once (parallel processing). Files that succeed leave the list,
    // so a retry after a partial failure only sends the ones that are left.
    const uploadImages = async (postindex: string) => {
        const results = await Promise.allSettled(filePreviews.map(async (fp) => {
            const contentData = new FormData();
            contentData.append('postindex', postindex);
            const contentResponse = await api.post(GetServerAPIAddress('c', 'api/add'), contentData);
            const postcontentindex: string = contentResponse.data.postcontentindex;

            const imageData = new FormData();
            imageData.append('postcontentindex', postcontentindex);
            imageData.append('imagefile', fp.file);
            imageData.append('description', '');
            // Large files can take longer than the default request timeout.
            await api.post(GetServerAPIAddress('c', 'api/add/image2d'), imageData, { timeout: 0 });
        }));

        const uploaded = filePreviews.filter((_, i) => results[i].status === 'fulfilled');
        uploaded.forEach(fp => URL.revokeObjectURL(fp.url));
        setFilePreviews(prev => prev.filter(fp => !uploaded.includes(fp)));

        const failure = results.find((r): r is PromiseRejectedResult => r.status === 'rejected');
        if (failure) throw failure.reason;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (submitLockRef.current) return;
        setPostError(null);

        if (!currentUser) {
            setPostError(t.error_login_required);
            return;
        }

        const existingPost = postId ?? createdPostRef.current;
        const payload = { title, description, tags };

        submitLockRef.current = true;
        setSubmitting(true);
        try {
            let postindex: string;
            if (existingPost) {
                postindex = idSegment(existingPost);
                await api.put(GetServerAPIAddress('p', `${postindex}/update`), payload);
            } else {
                const response = await api.post(GetServerAPIAddress('p', 'api/submit'), payload);
                postindex = idSegment(response.data.postindex);
                createdPostRef.current = postindex;
            }
            if (filePreviews.length > 0) {
                await uploadImages(postindex);
            }
            navigate(`/p/${postindex}`);
        } catch (error) {
            if (import.meta.env.DEV) console.error('Error submitting post:', error);
            setPostError(t.error_submit_failed);
            showMessage(t.error_submit_failed, 'error');
        } finally {
            submitLockRef.current = false;
            setSubmitting(false);
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
                            accept="image/*"
                            multiple
                            hidden
                        />
                    </div>

                    {filePreviews.length > 0 && (
                        <div className="image-previews">
                            {filePreviews.map((fp, index) => (
                                <div key={fp.url} className="image-preview-wrapper">
                                    <img src={fp.url} alt={`Preview ${index + 1}`} className="image-preview" />
                                    <button
                                        type="button"
                                        className="image-remove-btn"
                                        onClick={() => removeFile(fp)}
                                        aria-label="Remove file"
                                    >×</button>
                                </div>
                            ))}
                        </div>
                    )}
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
                    <button type="submit" className="btn-primary" disabled={submitting}>
                        {isEditing ? t.btn_Update : t.btn_Submit}
                    </button>
                </div>

            </form>
        </div>
    );
}

export default PostEditor;
