import { useNavigate } from 'react-router-dom';
import { useClassNames } from '../base';
import './homepage.css';

import { useLang } from '../locale/localetextgetter';
import { useMessagebox } from '../ui/messagebox/messageboxcontext';
import { useSession } from '../SessionProvider';
import type { SessionUser } from '../session';
import type { LocaleTexts } from '../locale/locale.types';

interface AccountRowProps {
    user: SessionUser;
    isCurrent: boolean;
    onSwitch: (user: SessionUser) => void;
    onLogout: (user: SessionUser) => void;
    t: LocaleTexts['homepage'];
    tOpt: LocaleTexts['useroptions'];
}

function AccountRow({ user, isCurrent, onSwitch, onLogout, t, tOpt }: AccountRowProps) {
    const getClassNames = useClassNames();

    return (
        <div className={getClassNames(`home-account-row${isCurrent ? ' home-account-row--active' : ''}`)}>
            <div
                className={getClassNames('home-account-row__info')}
                onClick={() => !isCurrent && onSwitch(user)}
                style={{ cursor: isCurrent ? 'default' : 'pointer' }}
            >
                <span className={getClassNames('home-account-row__avatar')}>
                    {user.user_id?.charAt(0).toUpperCase()}
                </span>
                <span className={getClassNames('home-account-row__id')}>
                    {user.user_id}
                    {isCurrent && <span className={getClassNames('home-account-row__badge')}>{t.badge_current}</span>}
                </span>
            </div>
            {!isCurrent && (
                <button type="button" className="btn-ghost" onClick={() => onSwitch(user)}>
                    {t.btn_switch}
                </button>
            )}
            <button type="button" className="home-account-row__logout" onClick={() => onLogout(user)}>
                {tOpt.Logout}
            </button>
        </div>
    );
}

function Homepage() {
    const navigate = useNavigate();
    const getClassNames = useClassNames();
    const { showConfirm } = useMessagebox();
    const t = useLang('homepage');
    const tOpt = useLang('useroptions');
    const { currentUser, accounts, logout, switchAccount } = useSession();

    const handleViewProfile = (user: SessionUser) => navigate(`/u/${user.user_index_1st}`);
    const handleNewPost = () => navigate('/newpost');

    const handleLogoutAll = async () => {
        if (!(await showConfirm(t.confirm_logout_all, 'warning'))) return;
        accounts.forEach(account => logout(account));
    };

    return (
        <div id="HomeDiv" className={getClassNames('home-page')}>
            {currentUser ? (
                <div className={getClassNames('home-session-card')}>
                    <div className={getClassNames('home-session-card__header')}>
                        <div
                            className={getClassNames('home-session-card__current')}
                            onClick={() => handleViewProfile(currentUser)}
                        >
                            <span className={getClassNames('home-session-card__avatar')}>
                                {currentUser.user_id?.charAt(0).toUpperCase()}
                            </span>
                            <div className={getClassNames('home-session-card__meta')}>
                                <span className={getClassNames('home-session-card__welcome')}>{t.welcome_back}</span>
                                <span className={getClassNames('home-session-card__username')}>{currentUser.user_id}</span>
                            </div>
                        </div>
                        <button type="button" className="btn-secondary" onClick={() => handleViewProfile(currentUser)}>
                            {t.btn_view_profile}
                        </button>
                    </div>

                    <hr className="divider" />

                    <div className={getClassNames('home-session-card__accounts')}>
                        <span className={getClassNames('home-session-card__accounts-label')}>{t.lbl_accounts}</span>
                        {accounts.map(user => (
                            <AccountRow
                                key={user.user_index_1st}
                                user={user}
                                isCurrent={String(user.user_index_1st) === String(currentUser.user_index_1st)}
                                onSwitch={switchAccount}
                                onLogout={logout}
                                t={t}
                                tOpt={tOpt}
                            />
                        ))}
                    </div>

                    <div className={getClassNames('home-session-card__actions')}>
                        <button type="button" className="btn-primary" onClick={handleNewPost}>
                            {t.btn_new_post}
                        </button>
                        <button type="button" className="btn-secondary" onClick={() => navigate('/login')}>
                            {tOpt.add_account}
                        </button>
                        <button type="button" className="btn-danger" onClick={handleLogoutAll}>
                            {t.btn_logout_all}
                        </button>
                    </div>
                </div>
            ) : (
                <div className={getClassNames('home-welcome-card')}>
                    <h1 className={getClassNames('home-welcome-card__title')}>{t.welcome_title}</h1>
                    <p className={getClassNames('home-welcome-card__subtitle')}>{t.welcome_subtitle}</p>
                    <div className={getClassNames('home-welcome-card__actions')}>
                        <button type="button" className="btn-primary" onClick={() => navigate('/login')}>
                            {tOpt.Login}
                        </button>
                        <button type="button" className="btn-secondary" onClick={() => navigate('/signup')}>
                            {tOpt.SignUp}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Homepage;
