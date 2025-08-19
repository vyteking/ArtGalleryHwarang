import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import base, { GetServerAPIAddress, GetClassNames } from '../base';
import { useLocale } from '../locale/localeoptions';
import './personalpage.css';

function PersonalPage() {
    const { userindex1st } = useParams();
    const [ user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { localeTxt } = useLocale();

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
        return <div>{"Loading user data..."}</div>;
    }

    if (error) {
        return <div>error: {error}</div>;
    }

    if (!user) {
        return <div>{"User not found."}</div>;
    }

    const RedirectPost = () => {
        navigate("/newpost");
    };

    return (
        <div id="PersonalPage" className={GetClassNames("layout")}>
            <div id="Profile" className={GetClassNames("")}>
                <div id="ProfilePic" className={GetClassNames("")}>
                    {/* Placeholder for profile picture */}
                </div>
                <div id="UserName" className={GetClassNames("")}>
                    {user.user_id} ({user.user_index_1st})
                </div>
                <div id="Following" className={GetClassNames("")}>
                    {"following"}
                </div>
                <div id="Followers" className={GetClassNames("")}>
                    {"followers"}
                </div>
            </div>
            <div id="UserGallery" className={GetClassNames("")}>
                {/* Placeholder for user's gallery */}
            </div>
        </div>
    );
}

export default PersonalPage;
