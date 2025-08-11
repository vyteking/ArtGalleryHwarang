import { GetClassNames } from '../base';
import './personalpage.css'

function LoadPersonalInfo() {

}

function PersonalPage(userindex1st) {
    return (
        <div id="PersonalPage" className={GetClassNames("layout")}>
            <div id="Profile">
                <div id="ProfilePic">

                </div>
                <div id="UserName">
                    nickname (Index1st)
                </div>
                <div id="Following">
                    following
                </div>
                <div id="Followers">
                    followers
                </div>
            </div>
            <div id="UserGallery">

            </div>
        </div>
    );
}

export default PersonalPage;