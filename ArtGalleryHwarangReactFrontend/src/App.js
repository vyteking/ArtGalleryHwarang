import React from "react"
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Base from './base'
import Header from './ui/header/header'
import Footer from './ui/footer/footer'
import MainWin from './ui/main'
import './App.css';

function App() {
  const usersessions = Base.session.loginaccounts;
  const localesetup = Base.localeoptions;
  const layoutorientation = Base.localeoptions.GetTextorentation;

  return (
    <>
      <Header />
      <MainWin />
      <Footer />
    </>
  );
}

export default App;
