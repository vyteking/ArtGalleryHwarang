import React, {useState, useEffect} from "react"

import './App.css';
import './ui/orientation/orientationstyles.css'; // Import the existing CSS

import session, { useClassNames } from "./base";

import Header from './ui/header/header'
import UserInfoBox from "./userinfo/headeruserstatusbox"
import MainWin from './ui/mainwin'
import Messagebox from './ui/messagebox/messagebox'
import Footer from './ui/footer/footer'

function App() {
  const [isSidebar0Visible, setSidebar0Visibility] = useState(false);
  const [isUserInfoBoxVisible, setUserInfoBoxVisibility] = useState(false);
  const getClassNames = useClassNames();

  const toggleSidebar0 = () => {
    setSidebar0Visibility(!isSidebar0Visible);
  };

  const toggleUserInfoBox = () => {
    setUserInfoBoxVisibility(!isUserInfoBoxVisible);
  }

  return (
    <div className={getClassNames('App')}>
      <Header toggleSidebar={toggleSidebar0} toggleUserInfoBox={toggleUserInfoBox} />
      <UserInfoBox usersession={session} />
      <MainWin isSidebarVisible={isSidebar0Visible} />
      <Messagebox />
      <Footer />
    </div>
  );
}

export default App;