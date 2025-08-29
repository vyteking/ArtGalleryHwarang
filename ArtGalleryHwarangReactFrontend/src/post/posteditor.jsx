import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { GetClassNames } from '../base';
import './posteditor.css'

import axios from 'axios'

function PostInfoLoader({postindex}) {

}

function PostEditor({postauthorindex1st = null, postindex = null}) {
    const [postError, setPostError] = useState(null); // State to store post error messages

    const navigate = useNavigate();
    const { localeTxt } = useLocale();

    const handlwSubmit = async (e) => {
        e.prevemtDefault();
        setPostError(null);

        const postdata = {};
    };

    const handleReset = () => {

    };

    return (
        <div id="posteditor" className={GetClassNames("layout")}>
            <form id="posteditorform" method="POST" className={GetClassNames()}>
                <div id="posttitle" className={GetClassNames()}>
                    <input type="text" id="titleinput"/>
                </div>
                <div id="contextuploader">
                    <input type="file" id="fileuploader" multiple/>
                </div>
                <div id="postdescription">
                    <textarea id="descriptiontextarea">
                        description
                    </textarea>
                </div>
                <div id="posttags">
                    <input type="text" id="taginput"/>
                </div>
                <div>
                    <div id="postoptions">
                        <button id="submitbutton" type="submit">Submit</button>
                        <button id="resetbutton" type="reset" onClick={handleReset}>Reset</button>
                        <button id="cancelbutton">Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default PostEditor;