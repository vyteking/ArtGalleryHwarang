import './posteditor.css'

import axios from 'axios'

function PostEditor() {
    return () => {
        <div id="posteditor" className={GetClassNames("layout")}>
            <form id="posteditorform" method="POST">
                <div id="posttitle" className={GetClassNames()}>
                    <input type="text" id="titleinput"/>
                </div>
                <div id="contextuploader">
                    <input type="file" id="fileuploader"/>
                </div>
                <div>
                    <textarea>
                        description
                    </textarea>
                </div>
                <div>
                    <input type="text" id="taginput"/>
                </div>
                <div>
                    <div id="postoptions">
                        <button id="submitbutton" type="submit">Submit</button>
                        <button id="resetbutton">Reset</button>
                        <button id="cancelbutton">Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    };
}

export default PostEditor;