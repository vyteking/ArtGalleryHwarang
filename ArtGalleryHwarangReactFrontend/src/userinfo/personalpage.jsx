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
    const [user, setUser] = useState(null);
    const [userMedia, setUserMedia] = useState(null);
    const [error, setError] = useState(null);

    const { userindex1st } = useParams();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                setError(null);
                const userDetailAddress = GetServerAPIAddress('u', `${userindex1st}`);
                const response = await axios.get(userDetailAddress);
                setUser(response.data);
                setUserMedia(response.data.media || null);
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

    const profilePic = userMedia?.user_profile_pic
        ? <img className={getClassNames("ProfilePic ImageIcon")} src={userMedia.user_profile_pic} alt="Profile" />
        : <div id="greyIcon" className={getClassNames("ProfilePic ImageIcon")}></div>;

    const headerImg = userMedia?.user_header_image
        ? <img className={getClassNames("Header Background")} src={userMedia.user_header_image} alt="Header" />
        : <div id="greyBG" className={getClassNames("Header Background")}></div>;

    if (loading) {
        return <div id="PersonalPage" className={getClassNames("layout")}><div>Loading user data...</div></div>;
    }

    if (error) {
        return <div id="PersonalPage" className={getClassNames("layout")}><div>Error: {error}</div></div>;
    }

    if (!user) {
        return <div id="PersonalPage" className={getClassNames("layout")}><div>User not found.</div></div>;
    }

    return (
        <div id="PersonalPage" className={getClassNames("layout")}>
            <div id="ProfileHeader" className={getClassNames("")}>
                {headerImg}
            </div>
            <div id="Profile" className={getClassNames("")}>
                <div id="ProfilePic" className={getClassNames("ImageIcon")}>
                    {profilePic}
                </div>
                <div id="UserName" className={getClassNames("")}>
                    {user.user_id} ({user.user_index_1st})
                </div>
                <div id="Following" className={getClassNames("")}>
                    following
                </div>
                <div id="Followers" className={getClassNames("")}>
                    followers
                </div>
            </div>
            <div id="UserGallery" className={getClassNames("")}>
                {/* User's posts/gallery will be rendered here */}
            </div>
        </div>
    );
}

export default PersonalPage;
