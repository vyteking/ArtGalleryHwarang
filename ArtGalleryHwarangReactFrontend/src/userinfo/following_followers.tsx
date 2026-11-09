import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, idSegment } from '../api';
import { GetServerAPIAddress, useClassNames } from '../base';
import { useLocale } from '../locale/localeoptions';
import { usePluralForm } from '../locale/localetextgetter';
import { Avatar } from './userprofile';
import type { UserSummary } from './userprofile';
import './following_followers.css';

type FollowListKind = 'following' | 'followers';

function UserBar({ user }: { user: UserSummary }) {
    const getClassNames = useClassNames();
    return (
        <li className={getClassNames('')}>
            <Link to={`/u/${user.user_index_1st}`} className={getClassNames('userbar')}>
                <Avatar src={user.user_profile_pic} name={user.user_id} className="userbar-avatar" />
                <span className={getClassNames('userbar-names')}>
                    <span className={getClassNames('userbar-name')}>{user.username || user.user_id}</span>
                    <span className={getClassNames('userbar-id')}>@{user.user_id}</span>
                </span>
            </Link>
        </li>
    );
}

// Following / followers list shown in a centred dialog over the blurred page behind it.
// Rendered as a child route of the personal page or the user info page; closing returns to the parent route.
function FollowListModal({ kind }: { kind: FollowListKind }) {
    const { userindex1st } = useParams<{ userindex1st: string }>();
    const navigate = useNavigate();
    const { localeTxt } = useLocale();
    const getClassNames = useClassNames();
    const plural = usePluralForm();
    const dialogRef = useRef<HTMLDivElement>(null);

    const [users, setUsers] = useState<UserSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const pageTxt = localeTxt.userinfopage;
    const close = () => navigate('..', { replace: true });

    useEffect(() => {
        if (!userindex1st) return;
        let cancelled = false;
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(false);
                const response = await api.get<UserSummary[]>(GetServerAPIAddress('u', `${idSegment(userindex1st)}/${kind}`));
                if (!cancelled) setUsers(response.data);
            } catch (err) {
                if (import.meta.env.DEV) console.error(`Error fetching ${kind}:`, err);
                if (!cancelled) setError(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchUsers();
        return () => { cancelled = true; };
    }, [userindex1st, kind]);

    // Close on Escape, lock page scroll while open, and move focus into the dialog.
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') navigate('..', { replace: true });
        };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKeyDown);
        dialogRef.current?.focus();
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [navigate]);

    const countTxt = localeTxt.statistic_with_count ?? localeTxt.statistic;
    const tabs: FollowListKind[] = ['following', 'followers'];

    let content;
    if (loading) {
        content = (
            <div className={getClassNames('profile-state followlist-state')}>
                <div className={getClassNames('profile-spinner')} />
            </div>
        );
    } else if (error) {
        content = <p className={getClassNames('followlist-empty')}>{pageTxt.load_error}</p>;
    } else if (users.length === 0) {
        content = (
            <p className={getClassNames('followlist-empty')}>
                {kind === 'following' ? pageTxt.no_following : pageTxt.no_followers}
            </p>
        );
    } else {
        content = (
            <ul className={getClassNames('followlist-users')}>
                {users.map(user => <UserBar key={user.user_index_1st} user={user} />)}
            </ul>
        );
    }

    return createPortal(
        <div className={getClassNames('follow-modal')} onClick={close}>
            <div
                ref={dialogRef}
                className={getClassNames('followlist-dialog')}
                role="dialog"
                aria-modal="true"
                aria-labelledby="FollowListTitle"
                tabIndex={-1}
                onClick={event => event.stopPropagation()}
            >
                <div className={getClassNames('followlist-header')}>
                    <nav className={getClassNames('followlist-tabs')} role="tablist">
                        {tabs.map(tab => (
                            <Link
                                key={tab}
                                id={tab === kind ? 'FollowListTitle' : undefined}
                                to={`../${tab}`}
                                replace
                                role="tab"
                                aria-selected={tab === kind}
                                className={getClassNames(`followlist-tab${tab === kind ? ' active' : ''}`)}
                            >
                                {tab === kind && !loading
                                    ? plural(countTxt[tab], users.length)
                                    : plural(localeTxt.statistic[tab], 2)}
                            </Link>
                        ))}
                    </nav>
                    <button
                        type="button"
                        className={getClassNames('followlist-close')}
                        aria-label={localeTxt.common.Close}
                        onClick={close}
                    >
                        ×
                    </button>
                </div>
                <div className={getClassNames('followlist-body')} role="tabpanel">
                    {content}
                </div>
            </div>
        </div>,
        document.body,
    );
}

export function FollowingList() {
    return <FollowListModal kind="following" />;
}

export function FollowersList() {
    return <FollowListModal kind="followers" />;
}
