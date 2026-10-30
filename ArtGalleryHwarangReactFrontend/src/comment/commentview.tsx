import { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import './commentview.css';
import { useClassNames, GetServerAPIAddress } from '../base';
import * as session from '../session';
import { useMessagebox } from '../ui/messagebox/messageboxcontext';
import { useLocale } from '../locale/localeoptions';
import { useLang } from '../locale/localetextgetter';
import axios from 'axios';
import CommentEditor from './commenteditor';

export interface CommentAuthor {
    user_index_1st?: string | number;
    user_id?: string;
}

export interface CommentData {
    replyindex: string;
    replycontent: string;
    replyauthor: CommentAuthor;
    created_at?: string;
}

interface CommentViewerProps {
    comment: CommentData;
    onUpdated: (comment: CommentData) => void;
    onDeleted: (replyindex: string) => void;
}

function CommentViewer({ comment, onUpdated, onDeleted }: CommentViewerProps) {
    const [isEditing, setIsEditing] = useState(false);
    const getClassNames = useClassNames();
    const { showMessage, showConfirm } = useMessagebox();
    const { currentLocale } = useLocale();
    const t = useLang('replieslist');

    const currentUser = session.GetCurrentLoginSession();
    const isOwner = Boolean(currentUser) &&
        String(currentUser?.user_index_1st) === String(comment.replyauthor.user_index_1st);
    const authorName = comment.replyauthor.user_id || t.anonymous;
    const timestamp = comment.created_at
        ? new Date(comment.created_at).toLocaleString(currentLocale.LocaleInfo.code, {
            dateStyle: 'medium',
            timeStyle: 'short',
        })
        : null;

    const handleDelete = async () => {
        if (!(await showConfirm(t.confirm_delete_reply, 'warning'))) return;
        try {
            const token = session.getAuthToken();
            await axios.delete(GetServerAPIAddress('r', `replies/${comment.replyindex}/`), {
                headers: { Authorization: `Token ${token}` }
            });
            onDeleted(comment.replyindex);
        } catch (error) {
            if (import.meta.env.DEV) console.error('Error deleting reply:', error);
            showMessage(t.error_delete_failed, 'error');
        }
    };

    if (isEditing) {
        return (
            <CommentEditor
                mode="edit"
                commentindex={comment.replyindex}
                initialValue={comment.replycontent}
                onCancel={() => setIsEditing(false)}
                onSaved={(updated) => {
                    setIsEditing(false);
                    onUpdated(updated);
                }}
            />
        );
    }

    return (
        <div id="commentviewer" className={getClassNames('comment-item card')}>
            <div className="comment-item__header">
                <div id="authorinfo" className="comment-item__author">
                    <span id="authoricon" className="comment-item__avatar">
                        {authorName[0]?.toUpperCase() ?? '?'}
                    </span>
                    <div className="comment-item__meta">
                        <span id="authorname" className="comment-item__username">{authorName}</span>
                        {timestamp && <span className="comment-item__timestamp">{timestamp}</span>}
                    </div>
                </div>

                {isOwner && (
                    <div id="commenteditbuttons" className="comment-item__owner-actions">
                        <button
                            id="btn_Edit"
                            type="button"
                            className="comment-icon-btn"
                            onClick={() => setIsEditing(true)}
                            aria-label={t.btn_edit}
                            title={t.btn_edit}
                        >
                            <PencilIcon className="comment-icon" />
                        </button>
                        <button
                            id="btn_Delete"
                            type="button"
                            className="comment-icon-btn comment-icon-btn--danger"
                            onClick={handleDelete}
                            aria-label={t.btn_delete}
                            title={t.btn_delete}
                        >
                            <TrashIcon className="comment-icon" />
                        </button>
                    </div>
                )}
            </div>

            <div id="commentbox" className="comment-item__box">
                <p id="commentcontext" className="comment-item__content">{comment.replycontent}</p>
            </div>
        </div>
    );
}

export default CommentViewer;
