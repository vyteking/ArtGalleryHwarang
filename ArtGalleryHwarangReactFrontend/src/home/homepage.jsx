import { Link } from "react-router-dom";
import base from '../base';

function Homepage() {
    console.log("Homepage");
    let loginuser = base.session.loginaccounts;
    let u = loginuser ? <Link to="/user/:userindex1st/">UserPage of {loginuser}</Link> : <Link to="/login">Login</Link>;

    return <div id="HomeDiv">{u}</div>
}

export default Homepage;