import React, {useEffect} from "react"

import Base from './base'

import Header from './ui/header/header'
import Footer from './ui/footer/footer'
import MainWin from './ui/main'
import './App.css';
import GetTextorentation from './localeoptions'

function App() {
  const usersessions = Base.session.loginaccounts;
  const localesetup = Base.localeoptions;
  const orientationCSS = Base.localeoptions.GetTextorentation;

  return (
    <>
      <Header />
      <MainWin />
      <Footer />
    </>
  );
}

export default App;
