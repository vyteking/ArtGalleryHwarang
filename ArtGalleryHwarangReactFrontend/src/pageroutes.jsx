import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Pages List
import Homepage from './home/homepage';
import Loginpage from './userinfo/loginpage';
import PersonalPage from './userinfo/personalpage';
import UserInfoPage from './userinfo/userinfopage';
import Signuppage from './userinfo/signuppage';

function PageRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/signup" element={<Signuppage />} />
        <Route path="/u/:userindex1st" element={<PersonalPage />} />
        <Route path="/u/:userindex1st/info" element={<UserInfoPage />} />
        <Route path="*" element={<Navigate to="/" />} />  {/* 잘못된 경로 리디렉션 */}
      </Routes>
  );
}

export default PageRoutes;