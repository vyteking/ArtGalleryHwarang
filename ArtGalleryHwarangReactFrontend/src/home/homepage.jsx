import { Link } from "react-router-dom";
import base, { GetClassNames } from '../base';
// import { useLocale } from "../locale/localeoptions";
import './homepage.css';

function Homepage() {
    let loginuser = base.session.loginaccounts;
    let u = loginuser ? <Link to="/user/:userindex1st/">UserPage of {loginuser}</Link> : <Link to="/login">Login</Link>;

    return <div id="HomeDiv">{u}</div>
}

export default Homepage;