import { Link } from 'react-router-dom'
import './galleryview.css'
import Base, { dirClass } from '../../base'

function PostBar(postindex, postimage) {
    return () => {
        <Link to="/p/:postindex">
            <div id="postbarview">
                <div id="postimage">
                    <img src={postimage}/>
                </div>
                <div id="postoption">
                    <Link to="/u/:userindex1st"><div id="postauthoricon">author</div></Link>
                    <Link to="/p/:postindex"><div id="posttitle">Title</div></Link>
                    <div id="postdate">postdate</div>
                    <Link to="/p/:postindex/givelike"><div id="postlike">like</div></Link>
                </div>
            </div>
        </Link>
    }
}

function PostGrid(postindex, postimage) {
    return () => {
        <Link to="/p/:postindex">
            <div id="postgridview">
                <div id="postimage">
                    <img src={postimage}/>
                </div>
                <div id="postoption">
                    <Link to="/u/:userindex1st"><div id="postauthoricon">author</div></Link>
                    <Link to="/p/:postindex"><div id="posttitle">Title</div></Link>
                    <Link to="/p/:postindex/givelike"><div id="postlike">like</div></Link>
                </div>
            </div>
        </Link>
    }
}

function GalleryGridView(postlist) {
    return () => {
        <div id="gallerygridview">

        </div>
    }
}

function PostListView(postindex, postimage) {
    return () => {
        <div id="postlistview">

        </div>
    }
}

function GalleryListView(postlist) {
    return () => {
        <div id="gallerygridview">

        </div>
    };
}

export default {
    GalleryGridView, 
    GalleryListView
}