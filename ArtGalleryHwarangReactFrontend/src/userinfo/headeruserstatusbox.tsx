import { Link, useNavigate } from 'react-router-dom';
import { useClassNames } from '../base';
import { useLocale } from '../locale/localeoptions';
import { useSession } from '../SessionProvider';
import type { SessionUser } from '../session';
import './headeruserstatusbox.css';

interface AccountEntryProps {
    user: SessionUser;
    isCurrent: boolean;
    onSwitch: (user: SessionUser) => void;
    onLogout: (user: SessionUser) => void;
}

function AccountEntry({ user, isCurrent, onSwitch, onLogout }: AccountEntryProps) {
    const getClassNames = useClassNames();

    return (
        <div className={getClassNames(`account-entry${isCurrent ? ' account-entry--active' : ''}`)}>
            <div
                className={getClassNames("account-entry__info")}
                onClick={() => !isCurrent && onSwitch(user)}
                style={{ cursor: isCurrent ? 'default' : 'pointer' }}
            >
                <span className={getClassNames("account-entry__initial")}>
                    {user.user_id?.charAt(0).toUpperCase()}
                </span>
                <span className={getClassNames("account-entry__id")}>
                    {user.user_id}
                    {isCurrent && <span className={getClassNames("account-entry__badge")}> ✓</span>}
                </span>
            </div>
            <button className={getClassNames("account-entry__logout")} onClick={() => onLogout(user)}>
                ✕
            </button>
        </div>
    );
}

function Loginuserinfobox() {
    const getClassNames = useClassNames();
    const { localeTxt } = useLocale();
    const { currentUser, accounts, logout, switchAccount } = useSession();
    const navigate = useNavigate();

    const handleLogout = (user: SessionUser) => {
        logout(user);
        const remaining = accounts.filter(a => String(a.user_index_1st) !== String(user.user_index_1st));
        if (remaining.length === 0) {
            navigate('/');
        }
    };

    const handleGoToProfile = () => {
        if (currentUser) {
            navigate(`/u/${currentUser.user_index_1st}`);
        }
    };

    return (
        <div className={getClassNames("topbox")}>
            <div className={getClassNames("topbox__actions")}>
                <button className={getClassNames("")}>{localeTxt.useroptions.notification}</button>
                <button className={getClassNames("")}>{localeTxt.useroptions.directmessage}</button>
            </div>

            <div className={getClassNames("topbox__current-user")} onClick={handleGoToProfile} style={{ cursor: 'pointer' }}>
                <span className={getClassNames("topbox__initial")}>
                    {currentUser?.user_id?.charAt(0).toUpperCase()}
                </span>
                <span className={getClassNames("topbox__username")}>{currentUser?.user_id}</span>
            </div>

            <div className={getClassNames("topbox__accounts")}>
                {accounts.map(account => (
                    <AccountEntry
                        key={account.user_index_1st}
                        user={account}
                        isCurrent={String(account.user_index_1st) === String(currentUser?.user_index_1st)}
                        onSwitch={switchAccount}
                        onLogout={handleLogout}
                    />
                ))}
            </div>

            <div className={getClassNames("topbox__footer")}>
                <button className={getClassNames("")} onClick={() => navigate('/login')}>
                    {localeTxt.useroptions.add_account}
                </button>
                <button className={getClassNames("")} onClick={() => navigate(`/u/${currentUser?.user_index_1st}/info`)}>
                    {localeTxt.useroptions.settings}
                </button>
            </div>
        </div>
    );
}

function UserinfoboxWhileNonLoggedIn() {
    const getClassNames = useClassNames();
    const { localeTxt } = useLocale();
    const navigate = useNavigate();

    return (
        <div id="loginbox" className={getClassNames("topbox")}>
            <div className={getClassNames("")}>
                <Link to='/login'><div id="LogoutUserIcon" className={getClassNames("")}></div></Link>
            </div>
            <div className={getClassNames("")}>
                <Link to='/login'><div id="PleaseLogin" className={getClassNames("")}>{localeTxt.useroptions.Login}</div></Link>
            </div>
            <div className={getClassNames("topbox__footer")}>
                <span className={getClassNames("")}><button id="Signup" className={getClassNames("")} onClick={() => navigate('/signup')}>{localeTxt.useroptions.SignUp}</button></span>
                <span className={getClassNames("")}><button id="login" className={getClassNames("")} onClick={() => navigate('/login')}>{localeTxt.useroptions.Login}</button></span>
            </div>
        </div>
    );
}

function UserInfoBox() {
    const { currentUser } = useSession();
    return currentUser ? <Loginuserinfobox /> : <UserinfoboxWhileNonLoggedIn />;
}

export default UserInfoBox;
