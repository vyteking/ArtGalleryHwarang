import { Link } from 'react-router-dom';
import './header.css';

import { useLocale } from '../../locale/localeoptions';
import { useClassNames } from '../../base';
import { useSession } from '../../SessionProvider';

function Usericon() {
    const { currentUser } = useSession();

    if (currentUser) {
        return (
            <div id="Loginusericon" title={currentUser.user_id}>
                {currentUser.user_id?.charAt(0).toUpperCase()}
            </div>
        );
    }
    return (
        <div id="UnloggedUserIcon" title="Login" />
    );
}

interface HeaderProps {
    toggleSidebar: () => void;
    toggleUserInfoBox: () => void;
}

function Header({ toggleSidebar, toggleUserInfoBox }: HeaderProps) {
    const getClassNames = useClassNames();
    const { localeTxt } = useLocale();

    return (
        <header id="headertag" className={getClassNames('layout')}>
            <div id="headerDiv" className={getClassNames('flexboxtype1')}>
                <button id="menubuttonspan" className={getClassNames('headerobject')} onClick={toggleSidebar}>
                    {/* {localeTxt.header.menu} */}<img id="menuImg" src="" />
                </button>
                <span id="headercentre" className={getClassNames('headerobject')}>
                    <span id="headertitle" className={getClassNames('headerobject')}>
                        <Link to="/">Title<img id="titleImg" src="" /></Link>
                    </span>
                </span>
                <span id="headeruserinfospan" className={getClassNames('headerobject')} onClick={toggleUserInfoBox}>
                    <Usericon />
                </span>
            </div>
        </header>
    );
}

export default Header;
