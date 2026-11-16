import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { api, idSegment } from '../api';
import { GetServerAPIAddress, useClassNames } from '../base';
import { useLocale } from '../locale/localeoptions';
import { useMessagebox } from '../ui/messagebox/messageboxcontext';
import type { UserInfoOutletContext } from './userinfopage';
import './userinfopage.css';
import './userinfoeditpage.css';

interface EditableProfileFields {
    username: string | null;
    user_alt_name: string | null;
    user_description: string | null;
}

// Edit Profile dialog, shown as a child route of the user info page (see pageroutes.tsx).
// Follows the same portal/dialog pattern as the following/followers modal.
function UserInfoEditPage() {
    const navigate = useNavigate();
    const { profile, isOwnProfile, onProfileUpdated } = useOutletContext<UserInfoOutletContext>();
    const { localeTxt } = useLocale();
    const getClassNames = useClassNames();
    const { showMessage } = useMessagebox();
    const dialogRef = useRef<HTMLDivElement>(null);

    const [username, setUsername] = useState(profile.username ?? '');
    const [altName, setAltName] = useState(profile.user_alt_name ?? '');
    const [description, setDescription] = useState(profile.user_description ?? '');
    const [submitting, setSubmitting] = useState(false);

    const pageTxt = localeTxt.userinfopage;
    const close = () => navigate('..', { replace: true });

    // Only the profile's own owner may edit it; bounce anyone else back to the profile.
    useEffect(() => {
        if (!isOwnProfile) navigate('..', { replace: true });
    }, [isOwnProfile, navigate]);

    // Close on Escape, lock page scroll while open, and move focus into the dialog.
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') close();
        };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKeyDown);
        dialogRef.current?.focus();
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', onKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!isOwnProfile) return null;

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (submitting) return;

        setSubmitting(true);
        try {
            const response = await api.patch<EditableProfileFields>(
                GetServerAPIAddress('u', `${idSegment(profile.user_index_1st)}/info/update`),
                {
                    username: username.trim(),
                    user_alt_name: altName.trim(),
                    user_description: description.trim(),
                },
            );
            onProfileUpdated(response.data);
            close();
        } catch (error) {
            if (import.meta.env.DEV) console.error('Error updating profile:', error);
            showMessage(pageTxt.profile_update_failed, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return createPortal(
        <div className={getClassNames('editprofile-modal')} onClick={close}>
            <div
                ref={dialogRef}
                className={getClassNames('editprofile-dialog')}
                role="dialog"
                aria-modal="true"
                aria-labelledby="EditProfileTitle"
                tabIndex={-1}
                onClick={event => event.stopPropagation()}
            >
                <div className={getClassNames('editprofile-header')}>
                    <h2 id="EditProfileTitle" className={getClassNames('editprofile-title')}>
                        {pageTxt.edit_profile_title}
                    </h2>
                    <button
                        type="button"
                        className={getClassNames('editprofile-close')}
                        aria-label={localeTxt.common.Close}
                        onClick={close}
                    >
                        ×
                    </button>
                </div>

                <form className={getClassNames('editprofile-body')} onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="EditProfileUsername">{localeTxt.userinfo.username}</label>
                        <input
                            id="EditProfileUsername"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder={pageTxt.tbx_username_placeholder}
                            maxLength={255}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="EditProfileAltName">{localeTxt.userinfo.useraltname}</label>
                        <input
                            id="EditProfileAltName"
                            type="text"
                            value={altName}
                            onChange={e => setAltName(e.target.value)}
                            placeholder={pageTxt.tbx_alt_name_placeholder}
                            maxLength={255}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="EditProfileDescription">{localeTxt.userinfo.userdescription}</label>
                        <textarea
                            id="EditProfileDescription"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder={pageTxt.tbx_description_placeholder}
                            rows={4}
                        />
                    </div>

                    <div className={getClassNames('editprofile-footer')}>
                        <button type="button" className="btn-secondary" onClick={close}>
                            {localeTxt.common.Cancel}
                        </button>
                        <button type="submit" className="btn-primary" disabled={submitting}>
                            {pageTxt.btn_save_profile}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body,
    );
}

export default UserInfoEditPage;
