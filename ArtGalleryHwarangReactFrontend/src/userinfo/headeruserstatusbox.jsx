import UserSession from '../session.tsx'
import { Link, useNavigate } from 'react-router-dom';
import { useClassNames } from '../../base';
import { useLocale } from '../locale/localeoptions.jsx';

import './headeruserstatusbox.css'

const isLoggedOn = false;

//Gain user information from the database
function GainUserInfo(usersession) {
    return null;
}

//User info box when the user is logged in
function loginuserinfobox(usersession) {
    const getClassNames = useClassNames();
    const { localeTxt } = useLocale();

    const navigate = useNavigate();

    const RedirectSwitchSession = () => {
        navigate('/ssn');
    };

    const RedirectLogout = () => {
        navigate('/ssn/logout/:userindex1st');
    };

    const RedirectUserInfo = () => {
        navigate('/u/:userindex1st');
    };

    return () => {  
        <div className={getClassNames("box")}>
            <div className={getClassNames("")}>
                <div className={getClassNames("")}><button className={getClassNames("")}>not.</button><button className={getClassNames("")}>DM</button></div>
                <div className={getClassNames("")}><button className={getClassNames("")} onClick={RedirectSwitchSession}>Switchaccount</button><button className={getClassNames("")}>loginextra</button></div>
            </div>
            <div className={getClassNames("")}>
                <div className={getClassNames("")}>usericon</div>
            </div>
            <div className={getClassNames("")}>
                <div className={getClassNames("")}>username</div>
            </div>
            <div className={getClassNames("")}>
                <div className={getClassNames("")}>followings</div>
                <div className={getClassNames("")}>followers</div>
            </div>
            <div className={getClassNames("")}>
                <div className={getClassNames("")}><button className={getClassNames("")}>userinfopage</button></div>
                <div className={getClassNames("")}><button className={getClassNames("")} onClick={RedirectLogout}>logout</button></div>
            </div>
        </div>
    };
}

//User info box when the session is logged out
function userinfoboxWhileNonLoggedIn() {
    const getClassNames = useClassNames();
    const { localeTxt } = useLocale();

    const navigate = useNavigate();

    const RedirectLogin = () => {
        navigate("/login");
    };

    const RedirectSignup = () => {
        navigate("/signup");
    };

    return () => {  
        <div id="loginbox" className={getClassNames("box")}>
            <div className={getClassNames("")}>
                <Link to='/login'><div id="LogoutUserIcon" className={getClassNames("")}>logoutusericon</div></Link>
            </div>
            <div className={getClassNames("")}>
                <Link to='/login'><div id="PleaseLogin" className={getClassNames("")}>please login</div></Link>
            </div>
            <div className={getClassNames("")}>
                <Link><div id="ForgotID" className={getClassNames("")}>forgot id</div></Link>
                <div id="ForgotPW" className={getClassNames("")}><Link></Link>forgot password</div>
            </div>
            <div className={getClassNames("")}>
                <div className={getClassNames("")}><button id="Signup" className={getClassNames("")} onClick={RedirectSignup}>signup</button></div>
                <div className={getClassNames("")}><button id="login" className={getClassNames("")} onClick={RedirectLogin}>login</button></div>
            </div>
        </div>
    };
}

function UserInfoBox({usersession}) {
    const userinfo = GainUserInfo(usersession);
    if (isLoggedOn && usersession !== null && usersession !== undefined) return loginuserinfobox(usersession);
    else return userinfoboxWhileNonLoggedIn;
}

export default UserInfoBox;