import React, {useState, useEffect} from "react"

import Base from './base'
import './App.css';

import Header from './ui/header/header'
import UserInfoBox from "./userinfo/headeruserstatusbox"
import MainWin from './ui/mainwin'
import Messagebox from './ui/messagebox/messagebox'
import Footer from './ui/footer/footer'

function App() {
  const [isSidebar0Visible, setSidebar0Visibility] = useState(false);
  const [isUserInfoBoxVisible, setUserInfoBoxVisibility] = useState(false);

  const toggleSidebar0 = () => {
    setSidebar0Visibility(!isSidebar0Visible);
  };

  const toggleUserInfoBox = () => {
    setUserInfoBoxVisibility(!isUserInfoBoxVisible);
  }

  return (
    <>
      <Header toggleSidebar={toggleSidebar0} />
      <UserInfoBox />
      <MainWin isSidebarVisible={isSidebar0Visible} />
      <Messagebox />
      <Footer />
    </>
  );
}

export default App;