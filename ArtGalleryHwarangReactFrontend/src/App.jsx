import React, {useEffect} from "react"

import Base from './base'

import Header from './ui/header/header'
import Footer from './ui/footer/footer'
import MainWin from './ui/mainwin'
import Messagebox from './ui/messagebox/messagebox'
import './App.css';

function App() {
  return (
    <>
      <Header />
      <MainWin />
      <Footer />
      <Messagebox />
    </>
  );
}

export default App;