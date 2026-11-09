import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// The landing page ships in the main bundle. Other pages load when they are first visited.
import Homepage from './home/homepage';

const TrendingPostsList = lazy(() => import('./home/trending'));
const Loginpage = lazy(() => import('./userinfo/loginpage'));
const Signuppage = lazy(() => import('./userinfo/signuppage'));
const PersonalPage = lazy(() => import('./userinfo/personalpage'));
const UserInfoPage = lazy(() => import('./userinfo/userinfopage'));
const FollowingList = lazy(() => import('./userinfo/following_followers').then(m => ({ default: m.FollowingList })));
const FollowersList = lazy(() => import('./userinfo/following_followers').then(m => ({ default: m.FollowersList })));
const PostView = lazy(() => import('./post/postview'));
const PostEditor = lazy(() => import('./post/posteditor'));

function PageRoutes() {
    return (
        <Suspense fallback={null}>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/hot" element={<TrendingPostsList />} />
                <Route path="/login" element={<Loginpage />} />
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
        </Suspense>
    );
}

export default PageRoutes;
