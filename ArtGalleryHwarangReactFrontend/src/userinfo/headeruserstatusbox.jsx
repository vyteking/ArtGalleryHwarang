import UserSession from '../session.tsx'
import { Link, useNavigate } from 'react-router-dom';

const isLoggedOn = false;

//Gain user information from the database
function GainUserInfo(usersession) {
    return null;
}

//User info box when the user is logged in
function loginuserinfobox(usersession) {
    const navigate = useNavigate();

    return () => {  
        <div>
            <div>
                <div><button>not.</button><button>DM</button></div>
                <div><button>Switchaccount</button><button>loginextra</button></div>
            </div>
            <div>
                <div>usericon</div>
            </div>
            <div>
                <div>username</div>
            </div>
            <div>
                <div>followings</div>
                <div>followers</div>
            </div>
            <div>
                <div><button>userinfopage</button></div>
                <div><button>logout</button></div>
            </div>
        </div>
    };
}

//User info box when the session is logged out
function userinfoboxWhileNonLoggedIn() {

    const navigate = useNavigate();

    const RedirectLogin = () => {
        navigate("/login");
    };

    const RedirectSignup = () => {
        navigate("/signup");
    };

    return () => {  
        <div>
            <div>
                <Link to='/login'><div id="LogoutUserIcon">logoutusericon</div></Link>
            </div>
            <div>
                <Link to='/login'><div id="PleaseLogin">please login</div></Link>
            </div>
            <div>
                <Link><div id="ForgotID">forgot id</div></Link>
                <div id="ForgotPW"><Link></Link>forgot password</div>
            </div>
            <div>
                <div><button id="Signup" onClick={RedirectSignup}>signup</button></div>
                <div><button id="login" onClick={RedirectLogin}>login</button></div>
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