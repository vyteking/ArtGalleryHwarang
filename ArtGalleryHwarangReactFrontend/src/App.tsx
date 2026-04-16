import { useState } from 'react';

import './design-system.css';
import './App.css';
import './responsive.css';
import './ui/orientation/orientationstyles.css';

import Header from './ui/header/header';
import UserInfoBox from './userinfo/headeruserstatusbox';
import MainWin from './ui/mainwin';
import Messagebox from './ui/messagebox/messagebox';
import Footer from './ui/footer/footer';
import UserInterfaceOption from './ui/userinterfaceoption/userinterfaceoption';
import { useClassNames } from './base';

export function App() {
    const [isSidebar0Visible, setSidebar0Visibility] = useState(false);
    const [isUserInfoBoxVisible, setUserInfoBoxVisibility] = useState(false);
    const [isDisplayOptionVisible, setDisplayOptionVisibility] = useState(false);
    const [isDateTimeScreenVisible, setDateTimeScreenVisibility] = useState(false);
    const getClassNames = useClassNames();

    const toggleSidebar0 = () => setSidebar0Visibility(!isSidebar0Visible);
    const toggleUserInfoBox = () => setUserInfoBoxVisibility(!isUserInfoBoxVisible);
    const toggleDisplayOptionBox = () => setDisplayOptionVisibility(!isDisplayOptionVisible);
    const toggleDateTimeBox = () => setDateTimeScreenVisibility(!isDateTimeScreenVisible);

    return (
        <div className={getClassNames('App')}>
            <Header toggleSidebar={toggleSidebar0} toggleUserInfoBox={toggleUserInfoBox} />
            {isUserInfoBoxVisible && <UserInfoBox />}
            <MainWin isSidebarVisible={isSidebar0Visible} />
            <Messagebox />
            <Footer toggleDisplayOption={toggleDisplayOptionBox} toggleDateTime={toggleDateTimeBox} />
            {isDisplayOptionVisible && <UserInterfaceOption toggleVisibility={toggleDisplayOptionBox} />}
        </div>
    );
}
