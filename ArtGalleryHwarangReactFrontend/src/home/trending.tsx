import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import base, { useClassNames } from '../base';
import './trending.css'

// Loads trending posts from the server
function TrendingPosts() {
    
}

// Shows up the visual list of the trending posts after loading them through `TrendingPosts`
function TrendingPostsList() {
    const list = TrendingPosts();
    const getClassNames = useClassNames();

    return () => {
        <div id="trendingpostslist" className={getClassNames("")}>

        </div>
    };
}

export default {
    TrendingPostsList
};