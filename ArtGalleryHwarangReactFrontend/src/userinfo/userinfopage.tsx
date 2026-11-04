import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import axios from 'axios';
import base, { GetServerAPIAddress, useClassNames } from '../base';
import { useLocale } from '../locale/localeoptions';
import { usePluralForm } from '../locale/localetextgetter';
import { Avatar, StatusBadge, LevelBadge } from './userprofile';
import type { UserProfile } from './userprofile';
import './userinfopage.css';

function Userinfopage() {
    const { userindex1st: routeUserIndex } = useParams<{ userindex1st: string }>();
    const { localeTxt, currentLocale } = useLocale();
    const getClassNames = useClassNames();
    const plural = usePluralForm();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fall back to the current login session when no user is given in the route.
    const userIndex = routeUserIndex ?? base.session.GetCurrentLoginSession()?.user_index_1st;
    const pageTxt = localeTxt.userinfopage;

    useEffect(() => {
        if (!userIndex) {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get<UserProfile>(GetServerAPIAddress('u', `${userIndex}/info`));
                setProfile(response.data);
            } catch (err) {
                if (import.meta.env.DEV) console.error('Error fetching user info:', err);
                setProfile(null);
                setError(axios.isAxiosError(err) && err.response?.status === 404
                    ? pageTxt.user_not_found
                    : pageTxt.load_error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userIndex, pageTxt.user_not_found, pageTxt.load_error]);

    if (loading || error || !profile) {
        return (
            <div id="UserinfopageContainer" className={getClassNames('userinfo-page layout')}>
                <div className={getClassNames('profile-state')}>
                    {loading && <div className={getClassNames('profile-spinner')} />}
                    <p className={getClassNames('')}>{loading ? pageTxt.loading_user_info : (error ?? pageTxt.user_not_found)}</p>
                </div>
            </div>
        );
    }

    const notSet = <span className={getClassNames('userinfo-notset')}>{pageTxt.not_set}</span>;
    const joinDate = new Date(profile.user_join_date).toLocaleDateString(currentLocale.LocaleInfo.code, {
        year: 'numeric', month: 'long', day: 'numeric',
    });
    const countTxt = localeTxt.statistic_with_count ?? localeTxt.statistic;

    const rows: { key: string; label: string; value: ReactNode; wide?: boolean }[] = [
        { key: 'userid', label: localeTxt.userinfo.userID, value: profile.user_id },
        {
            key: 'userindex1st',
            label: localeTxt.userinfo.userindex1st,
            value: <code className={getClassNames('userinfo-index')}>{profile.user_index_1st}</code>,
        },
        {
            key: 'status',
            label: localeTxt.userinfo.userstatus,
            value: <StatusBadge status={profile.user_status} />,
        },
        {
            key: 'level',
            label: localeTxt.userinfo.userlevel,
            value: <LevelBadge level={profile.user_level} />,
        },
        { key: 'username', label: localeTxt.userinfo.username, value: profile.username || notSet },
        { key: 'altname', label: localeTxt.userinfo.useraltname, value: profile.user_alt_name || notSet },
        { key: 'joindate', label: localeTxt.userinfo.userjoindate, value: joinDate },
        {
            key: 'description',
            label: localeTxt.userinfo.userdescription,
            value: profile.user_description
                ? <p className={getClassNames('userinfo-description')}>{profile.user_description}</p>
                : notSet,
            wide: true,
        },
    ];

    return (
        <div id="UserinfopageContainer" className={getClassNames('userinfo-page layout')}>
            <section className={getClassNames('userinfo-hero card')}>
                <div
                    className={getClassNames(`userinfo-header${profile.user_header_image ? '' : ' userinfo-header-empty'}`)}
                    style={profile.user_header_image
                        ? { backgroundImage: `url("${profile.user_header_image}")` }
                        : undefined}
                    role="img"
                    aria-label={profile.user_header_image ? `${profile.user_id} header` : undefined}
                />
                <div className={getClassNames('userinfo-identity')}>
                    <Avatar
                        src={profile.user_profile_pic}
                        name={profile.user_id}
                        className="userinfo-avatar"
                    />
                    <div className={getClassNames('userinfo-names')}>
                        <h2 className={getClassNames('userinfo-displayname')}>
                            <Link to={`/u/${profile.user_index_1st}`} className={getClassNames('')}>
                                {profile.username || profile.user_id}
                            </Link>
                        </h2>
                        <span className={getClassNames('userinfo-handle')}>@{profile.user_id}</span>
                        {profile.user_alt_name && (
                            <span className={getClassNames('userinfo-altname')}>{profile.user_alt_name}</span>
                        )}
                    </div>
                    <div className={getClassNames('userinfo-stats')}>
                        <Link to="following" className={getClassNames('userinfo-stat')}>
                            {plural(countTxt.following, profile.following_count)}
                        </Link>
                        <Link to="followers" className={getClassNames('userinfo-stat')}>
                            {plural(countTxt.followers, profile.followers_count)}
                        </Link>
                    </div>
                </div>
            </section>

            <div className={getClassNames('userinfo-body')}>
                <section className={getClassNames('userinfo-details card')}>
                    <dl className={getClassNames('userinfo-rows')}>
                        {rows.map(row => (
                            <div key={row.key} className={getClassNames(`userinfo-row${row.wide ? ' wide' : ''}`)}>
                                <dt className={getClassNames('')}>{row.label}</dt>
                                <dd className={getClassNames('')}>{row.value}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

            </div>

            {/* Following / followers dialog (child routes) */}
            <Outlet />
        </div>
    );
}

export default Userinfopage;
