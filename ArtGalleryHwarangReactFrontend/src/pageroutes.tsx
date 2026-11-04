import { Routes, Route, Navigate } from 'react-router-dom';

// Pages List
import Homepage from './home/homepage';
import TrendingPostsList from './home/trending';
import Loginpage from './userinfo/loginpage';
import Signuppage from './userinfo/signuppage';
import PersonalPage from './userinfo/personalpage';
import UserInfoPage from './userinfo/userinfopage';
import { FollowingList, FollowersList } from './userinfo/following_followers';
import PostView from './post/postview';
import PostEditor from './post/posteditor';
import { SessionManager, LogoutUser, LogoutAll } from './session';

function PageRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/hot" element={<TrendingPostsList />} />
            <Route path="/login" element={<Loginpage />} />
            <Route path="/ssn" element={<SessionManager />} />
            <Route path="/ssn/logout/:userindex1st" element={<LogoutUser />} />
            <Route path="/ssn/logout/all" element={<LogoutAll />} />
            <Route path="/signup" element={<Signuppage />} />
            {/* Following / followers open as a dialog over the personal page or the user info page */}
            <Route path="/u/:userindex1st" element={<PersonalPage />}>
                <Route path="following" element={<FollowingList />} />
                <Route path="followers" element={<FollowersList />} />
            </Route>
            <Route path="/u/:userindex1st/info" element={<UserInfoPage />}>
                <Route path="following" element={<FollowingList />} />
                <Route path="followers" element={<FollowersList />} />
            </Route>
            <Route path="/u/random" element={<Homepage />} />
            <Route path="/p/:postindex" element={<PostView />} />
            <Route path="/p/:postindex/edit" element={<PostEditor />} />
            <Route path="/newpost" element={<PostEditor />} />
            <Route path="/p/random" element={<Homepage />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default PageRoutes;
