import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import base, { GetServerAPIAddress, useClassNames } from '../base';
import { useLocale } from '../locale/localeoptions';
import './personalpage.css';

function PersonalPage() {
    const navigate = useNavigate();
    const { localeTxt } = useLocale();
    const getClassNames = useClassNames();

    const [loading, setLoading] = useState(true);

    const [ user, setUser ] = useState(null);
    const { userindex1st } = useParams();

    const { userMedia, setUserMedia } = useState(null);
    const { profilePix, setProfilePix } = useState(null);
    const { headerImg, setHeaderImg } = useState(null);

    const [error, setError] = useState(null);
    const { displaycontext, setDisplayContext } = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                setError(null);
                const userDetailAddress = GetServerAPIAddress('u', `${userindex1st}`);
                const response = await axios.get(userDetailAddress);
                setUser(response.data);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to load user data.");
            } finally {
                setLoading(false);
            }
        };

        if (userindex1st) {
            fetchUserData();
        }
    }, [userindex1st]);

    if (loading) {
        setDisplayContext(<div>{"Loading user data..."}</div>);
        return <div id="PersonalPage" className={getClassNames("layout")}>{displaycontext}</div>;
    }

    if (error) {
        setDisplayContext(<div>error: {error}</div>);
        return <div id="PersonalPage" className={getClassNames("layout")}>{displaycontext}</div>;
    }

    if (!user) {
        setDisplayContext(<div>{"User not found."}</div>);
        return <div id="PersonalPage" className={getClassNames("layout")}>{displaycontext}</div>;
    } 

    if (!userMedia) {
        setProfilePix(<div id="greyIcon" className={getClassNames("ProfilePic ImageIcon")}></div>);
        setHeaderImg(<div id="greyBG" className={getClassNames("Header Background")}></div>);
    } else {
        setProfilePix(<img className={getClassNames("ProfilePic ImageIcon")} src={userMedia.user_profile_pic} />);
        setHeaderImg(<img className={getClassNames("Header Background")} src={userMedia.user_header_image} />);
    }

    const RedirectPost = () => {
        navigate("/newpost");
    };

    setDisplayContext(() => {
        <div id="PersonalPage" className={getClassNames("layout")}>
            <div id="Profile" className={getClassNames("")}>
                <div id="ProfilePic" className={getClassNames("ImageIcon")}>
                    {/* Placeholder for profile picture */}
                    {headerImg}
                </div>
                <div id="UserName" className={getClassNames("")}>
                    {user.user_id} ({user.user_index_1st})
                </div>
                <div id="Following" className={getClassNames("")}>
                    {"following"}
                </div>
                <div id="Followers" className={getClassNames("")}>
                    {"followers"}
                </div>
            </div>
            <div id="UserGallery" className={getClassNames("")}>
                {/* Placeholder for user's gallery */}
            </div>
        </div>
    });
    return displaycontext;
}

export default PersonalPage;