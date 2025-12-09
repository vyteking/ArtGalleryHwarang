import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Pages List
import Homepage from './home/homepage';
import Trending from './home/trending';
import Loginpage from './userinfo/loginpage';
import Signuppage from './userinfo/signuppage';
import PersonalPage from './userinfo/personalpage';
import UserInfoPage from './userinfo/userinfopage';
import { FollowingList, FollowersList } from './userinfo/following_followers';
import PostView from './post/postview';
import PostEditor from './post/posteditor';
import { SessionManager, LogoutUser, LogoutAll } from './session.tsx';

function PageRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/hot" element={<Trending />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/ssn" element={<SessionManager />} />
        <Route path="/ssn/logout/:userindex1st" element={<LogoutUser />} /> {/* Logout for a single session */}
        <Route path="/ssn/logout/all" element={<LogoutAll />} />
        <Route path="/signup" element={<Signuppage />} />
        <Route path="/u/:userindex1st" element={<PersonalPage />} />
        <Route path="/u/:userindex1st/info" element={<UserInfoPage />} />
        <Route path="/u/random" element={<Homepage />} />
        <Route path="/u/:userindex1st/following" element={<FollowingList />} />
        <Route path="/u/:userindex1st/followers" element={<FollowersList />} />
        <Route path="/p/:postindex" element={<PostView />} />
        <Route path="/p/:postindex/edit" element={<PostEditor />} />
        <Route path="/newpost" element={<PostEditor />} />
        <Route path="/p/random" element={<Homepage />} />
        <Route path="*" element={<Navigate to="/" />} />  {/* Redirection of the incorrect path/ 잘못된 경로 리디렉션 */}
      </Routes>
  );
}

export default PageRoutes;