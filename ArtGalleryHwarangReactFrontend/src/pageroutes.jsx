import React from 'react'
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom'

function PageRoutes() {
    return (
        <Routes>
            <Route path="/login"/>
            <Route path="/signup"/>
            <Route path="/userinfo"/>
        </Routes>
    );
}

export default PageRoutes;