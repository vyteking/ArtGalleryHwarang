import { useState } from 'react';
import type { FormEvent } from 'react';
import './commentview.css';
import './commenteditor.css';
import { useClassNames, GetServerAPIAddress } from '../base';
import * as session from '../session';
import { useMessagebox } from '../ui/messagebox/messageboxcontext';
import { useLang } from '../locale/localetextgetter';
import axios from 'axios';
import type { CommentData } from './commentview';

interface CommentEditorCreateProps {
    mode: 'create';
    postindex: string;
    onCreated: (comment: CommentData) => void;
}

interface CommentEditorEditProps {
    mode: 'edit';
    commentindex: string;
    initialValue: string;
    onCancel: () => void;
    onSaved: (comment: CommentData) => void;
}

type CommentEditorProps = CommentEditorCreateProps | CommentEditorEditProps;

function CommentEditor(props: CommentEditorProps) {
    const [content, setContent] = useState(props.mode === 'edit' ? props.initialValue : '');
    const [submitting, setSubmitting] = useState(false);

    const getClassNames = useClassNames();
    const { showMessage } = useMessagebox();
    const tc = useLang('common');
    const tr = useLang('replieslist');

    const handleReset = () => {
        if (props.mode === 'edit') {
            props.onCancel();
        } else {
            setContent('');
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!content.trim() || submitting) return;

        setSubmitting(true);
        try {
            const token = session.getAuthToken();
            if (props.mode === 'create') {
                const response = await axios.post<CommentData>(
                    GetServerAPIAddress('r', `posts/${props.postindex}/replies/`),
                    { replycontent: content },
                    { headers: { Authorization: `Token ${token}` } }
                );
                setContent('');
                props.onCreated(response.data);
            } else {
                const response = await axios.patch<CommentData>(
                    GetServerAPIAddress('r', `replies/${props.commentindex}/`),
                    { replycontent: content },
                    { headers: { Authorization: `Token ${token}` } }
                );
                props.onSaved(response.data);
            }
        } catch (error) {
            if (import.meta.env.DEV) console.error('Error submitting comment:', error);
            showMessage(props.mode === 'create' ? tr.reply_submission_error : tr.error_edit_failed, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const isEditMode = props.mode === 'edit';

    return (
        <form
            id="commenteditor"
            className={getClassNames(`comment-editor${isEditMode ? ' comment-editor--inline' : ''}`)}
            onSubmit={handleSubmit}
        >
            <div id="commentcontext" className="comment-editor__field">
                <textarea
                    id="commentinputcontext"
                    className="comment-editor__textarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={tr.tbx_reply_Placeholder}
                    rows={isEditMode ? 2 : 3}
                />
            </div>
            <div id="commentoptions" className="comment-editor__actions">
                <div id="commenteditbuttons" className="comment-editor__buttons">
                    <button id="btn_Reset" type="button" className="btn-ghost" onClick={handleReset}>
                        {isEditMode ? tc.Cancel : tc.Reset}
                    </button>
                    <button id="btn_Submit" type="submit" className="btn-primary" disabled={submitting}>
                        {isEditMode ? tr.btn_save : tr.btn_submit_reply}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default CommentEditor;
