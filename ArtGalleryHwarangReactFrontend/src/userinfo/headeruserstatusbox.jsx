import { Link, useNavigate } from 'react-router-dom';
import { useClassNames } from '../base';
import { useLocale } from '../locale/localeoptions.jsx';
import { useSession } from '../SessionProvider';

import './headeruserstatusbox.css'

//User info box when the user is logged in
function Loginuserinfobox() {
    const getClassNames = useClassNames();
    const { localeTxt } = useLocale();
    const { currentUser, logout } = useSession();

    const navigate = useNavigate();

    const handleLogout = () => {
        // Assuming logout function handles the logic
        logout();
        navigate('/');
    };

    const RedirectUserInfo = () => {
        if(currentUser) {
            navigate(`/u/${currentUser.user_index_1st}`);
        }
    };

    return (  
        <div className={getClassNames("topbox")}>
            <div className={getClassNames("")}>
                <div className={getClassNames("")}><button className={getClassNames("")}>not.</button><button className={getClassNames("")}>DM</button></div>
                <div className={getClassNames("")}><button className={getClassNames("")}>Switchaccount</button><button className={getClassNames("")}>loginextra</button></div>
            </div>
            <div className={getClassNames("")}>
                <div className={getClassNames("")} onClick={RedirectUserInfo} style={{cursor: 'pointer'}}>usericon</div>
            </div>
            <div className={getClassNames("")}>
                <div className={getClassNames("")} onClick={RedirectUserInfo} style={{cursor: 'pointer'}}>{currentUser?.user_id}</div>
            </div>
            <div className={getClassNames("")}>
                <div className={getClassNames("")}>followings</div>
                <div className={getClassNames("")}>followers</div>
            </div>
            <div className={getClassNames("")}>
                <div className={getClassNames("")}><button className={getClassNames("")} onClick={RedirectUserInfo}>userinfopage</button></div>
                <div className={getClassNames("")}><button className={getClassNames("")} onClick={handleLogout}>logout</button></div>
            </div>
        </div>
    );
}

//User info box when the session is logged out
function UserinfoboxWhileNonLoggedIn() {
    const getClassNames = useClassNames();
    const { localeTxt } = useLocale();

    const navigate = useNavigate();

    const RedirectLogin = () => {
        navigate("/login");
    };

    const RedirectSignup = () => {
        navigate("/signup");
    };

    return (  
        <div id="loginbox" className={getClassNames("topbox")}>
            <div className={getClassNames("")}>
                <Link to='/login'><div id="LogoutUserIcon" className={getClassNames("")}>logoutusericon</div></Link>
            </div>
            <div className={getClassNames("")}>
                <Link to='/login'><div id="PleaseLogin" className={getClassNames("")}>please login</div></Link>
            </div>
            <div className={getClassNames("")}>
                <Link to=''><div id="ForgotID" className={getClassNames("")}>forgot id</div></Link>
                <div id="ForgotPW" className={getClassNames("")}><Link to=''></Link>forgot password</div>
            </div>
            <div className={getClassNames("")}>
                <span className={getClassNames("")}><button id="Signup" className={getClassNames("")} onClick={RedirectSignup}>signup</button></span>
                <span className={getClassNames("")}><button id="login" className={getClassNames("")} onClick={RedirectLogin}>login</button></span>
            </div>
        </div>
    );
}

function UserInfoBox({ }) {
    const { currentUser } = useSession();
    if (currentUser) {
        return <Loginuserinfobox />;
    }
    else {
        return <UserinfoboxWhileNonLoggedIn />;
    }
}

export default UserInfoBox;