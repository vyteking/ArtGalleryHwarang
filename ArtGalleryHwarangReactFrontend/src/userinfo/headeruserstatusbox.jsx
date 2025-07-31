import UserSession from '../session.tsx'
import { useNavigate } from 'react-router-dom';

const isLoggedOn = false;

//Gain user information from the database
function GainUserInfo(usersession) {
    return null;
}

//User info box when the user is logged in
function loginuserinfobox(usersession) {
    return () => {  
        <div>
            <table>
                <tr>
                    <td>
                        <div><button>not.</button><button>DM</button></div>
                    </td>
                    <td>
                        <div><button>Switchaccount</button><button>loginextra</button></div>
                    </td>
                </tr>
                <tr>
                    <td colspan="2"><div>usericon</div></td>
                </tr>
                <tr>
                    <td colspan="2">username</td>
                </tr>
                <tr>
                    <td>followings</td>
                    <td>followers</td>
                </tr>
                <tr>
                    <td><button>userinfopage</button></td>
                    <td><button>logout</button></td>
                </tr>
            </table>
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
            <table>
                <tr>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td colspan="2">logoutusericon</td>
                </tr>
                <tr>
                    <td colspan="2">please login</td>
                </tr>
                <tr>
                    <td id="ForgotID">forgot id</td>
                    <td id="ForgotPW">forgot password</td>
                </tr>
                <tr>
                    <td><button id="Signup" onClick={RedirectSignup}>signup</button></td>
                    <td><button id="login" onClick={RedirectLogin}>login</button></td>
                </tr>
            </table>
        </div>
    };
}

function UserInfoBox({usersession}) {
    const userinfo = GainUserInfo(usersession);
    if (isLoggedOn && usersession !== null && usersession !== undefined) return loginuserinfobox(usersession);
    else return userinfoboxWhileNonLoggedIn;
}

export default UserInfoBox;