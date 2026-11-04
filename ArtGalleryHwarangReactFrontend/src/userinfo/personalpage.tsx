import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import axios from 'axios';
import base, { GetServerAPIAddress, useClassNames } from '../base';
import { useLocale } from '../locale/localeoptions';
import { usePluralForm } from '../locale/localetextgetter';
import type { LocaleTexts } from '../locale/locale.types';
import { Avatar, StatusBadge, LevelBadge } from './userprofile';
import type { UserProfile } from './userprofile';
import './personalpage.css';

// Submission types, matching GALLERY_CONTENT_TYPES in the Django post serializer.
const SUBMISSION_TYPES = ['blogcontent', 'image2d', 'animation2d', 'object3d', 'audio', 'video'] as const;
type SubmissionType = typeof SUBMISSION_TYPES[number];
type GalleryTab = 'all' | SubmissionType;
const GALLERY_TABS: GalleryTab[] = ['all', ...SUBMISSION_TYPES];

// Response items of /p/u/<user_index_1st> (PostGallerySerializer).
interface GalleryPost {
    postindex: string;
    title: string;
    isInPublic: boolean;
    created_at: string;
    content_types: SubmissionType[];
    thumbnail: string | null;
}

interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    results: T[];
}

type PageTexts = LocaleTexts['personalpage'];

function tabLabel(pageTxt: PageTexts, tab: GalleryTab): string {
    return pageTxt[`tab_${tab}`];
}

function authHeaders() {
    const token = base.session.getAuthToken();
    return token ? { Authorization: `Token ${token}` } : undefined;
}

// Description clamped to a few lines, with a toggle shown only when the text overflows.
function ProfileDescription({ text, pageTxt }: { text: string; pageTxt: PageTexts }) {
    const getClassNames = useClassNames();
    const [expanded, setExpanded] = useState(false);
    const [overflowing, setOverflowing] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);

    useLayoutEffect(() => {
        const element = textRef.current;
        if (!element) return;
        const measure = () => {
            if (!expanded) setOverflowing(element.scrollHeight > element.clientHeight + 1);
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        return () => observer.disconnect();
    }, [text, expanded]);

    return (
        <div className={getClassNames('pp-description')}>
            <p ref={textRef} className={getClassNames(`pp-description-text${expanded ? '' : ' clamped'}`)}>
                {text}
            </p>
            {(overflowing || expanded) && (
                <button
                    type="button"
                    className={getClassNames('pp-description-toggle')}
                    aria-expanded={expanded}
                    onClick={() => setExpanded(prev => !prev)}
                >
                    {expanded ? pageTxt.show_less : pageTxt.show_more}
                </button>
            )}
        </div>
    );
}

function GalleryCard({ post, pageTxt }: { post: GalleryPost; pageTxt: PageTexts }) {
    const getClassNames = useClassNames();
    return (
        <li className={getClassNames('pp-gallery-item')}>
            <Link to={`/p/${post.postindex}`} className={getClassNames('pp-gallery-card')}>
                <div className={getClassNames('pp-gallery-thumb')}>
                    {post.thumbnail
                        ? <img className={getClassNames('')} src={post.thumbnail} alt={post.title} loading="lazy" />
                        : <span className={getClassNames('pp-gallery-thumb-fallback')}>{post.title.charAt(0)}</span>}
                    {!post.isInPublic && (
                        <span className={getClassNames('pp-gallery-private')}>{pageTxt.private}</span>
                    )}
                </div>
                <div className={getClassNames('pp-gallery-meta')}>
                    <span className={getClassNames('pp-gallery-title')}>{post.title}</span>
                    {post.content_types.length > 0 && (
                        <span className={getClassNames('pp-gallery-types')}>
                            {post.content_types.map(type => tabLabel(pageTxt, type)).join(' · ')}
                        </span>
                    )}
                </div>
            </Link>
        </li>
    );
}

function GallerySection({ userIndex }: { userIndex: string }) {
    const { localeTxt } = useLocale();
    const getClassNames = useClassNames();
    const pageTxt = localeTxt.personalpage;

    const [activeTab, setActiveTab] = useState<GalleryTab>('all');
    const [posts, setPosts] = useState<GalleryPost[]>([]);
    const [nextPage, setNextPage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(false);
                const response = await axios.get<PaginatedResponse<GalleryPost>>(
                    GetServerAPIAddress('p', `u/${userIndex}`),
                    { params: activeTab === 'all' ? undefined : { type: activeTab }, headers: authHeaders() },
                );
                if (cancelled) return;
                setPosts(response.data.results);
                setNextPage(response.data.next);
            } catch (err) {
                if (import.meta.env.DEV) console.error('Error fetching submissions:', err);
                if (!cancelled) setError(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchPosts();
        return () => { cancelled = true; };
    }, [userIndex, activeTab]);

    const loadMore = async () => {
        if (!nextPage) return;
        try {
            setLoadingMore(true);
            const response = await axios.get<PaginatedResponse<GalleryPost>>(nextPage, { headers: authHeaders() });
            setPosts(prev => [...prev, ...response.data.results]);
            setNextPage(response.data.next);
        } catch (err) {
            if (import.meta.env.DEV) console.error('Error fetching more submissions:', err);
        } finally {
            setLoadingMore(false);
        }
    };

    let content;
    if (loading) {
        content = (
            <div className={getClassNames('profile-state pp-gallery-state')}>
                <div className={getClassNames('profile-spinner')} />
                <p className={getClassNames('')}>{pageTxt.loading_submissions}</p>
            </div>
        );
    } else if (error) {
        content = <p className={getClassNames('pp-gallery-empty')}>{localeTxt.userinfopage.load_error}</p>;
    } else if (posts.length === 0) {
        content = <p className={getClassNames('pp-gallery-empty')}>{pageTxt.no_submissions}</p>;
    } else {
        content = (
            <>
                <ul className={getClassNames('pp-gallery-grid')}>
                    {posts.map(post => <GalleryCard key={post.postindex} post={post} pageTxt={pageTxt} />)}
                </ul>
                {nextPage && (
                    <button
                        type="button"
                        className={getClassNames('btn-secondary pp-gallery-loadmore')}
                        onClick={loadMore}
                        disabled={loadingMore}
                    >
                        {pageTxt.load_more}
                    </button>
                )}
            </>
        );
    }

    return (
        <section id="UserGallery" className={getClassNames('card pp-gallery')}>
            <div className={getClassNames('pp-tabs')} role="tablist">
                {GALLERY_TABS.map(tab => (
                    <button
                        key={tab}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === tab}
                        className={getClassNames(`pp-tab${activeTab === tab ? ' active' : ''}`)}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tabLabel(pageTxt, tab)}
                    </button>
                ))}
            </div>
            <div className={getClassNames('pp-gallery-content')} role="tabpanel">
                {content}
            </div>
        </section>
    );
}

function PersonalPage() {
    const { userindex1st } = useParams<{ userindex1st: string }>();
    const { localeTxt } = useLocale();
    const getClassNames = useClassNames();
    const plural = usePluralForm();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const infoTxt = localeTxt.userinfopage;
    const pageTxt = localeTxt.personalpage;

    useEffect(() => {
        if (!userindex1st) return;
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get<UserProfile>(GetServerAPIAddress('u', `${userindex1st}/info`));
                setProfile(response.data);
            } catch (err) {
                if (import.meta.env.DEV) console.error('Error fetching user data:', err);
                setProfile(null);
                setError(axios.isAxiosError(err) && err.response?.status === 404
                    ? infoTxt.user_not_found
                    : infoTxt.load_error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [userindex1st, infoTxt.user_not_found, infoTxt.load_error]);

    if (loading || error || !profile) {
        return (
            <div id="PersonalPage" className={getClassNames('personal-page layout')}>
                <div className={getClassNames('profile-state')}>
                    {loading && <div className={getClassNames('profile-spinner')} />}
                    <p className={getClassNames('')}>
                        {loading ? infoTxt.loading_user_info : (error ?? infoTxt.user_not_found)}
                    </p>
                </div>
            </div>
        );
    }

    const countTxt = localeTxt.statistic_with_count ?? localeTxt.statistic;

    return (
        <div id="PersonalPage" className={getClassNames('personal-page layout')}>
            <section id="Profile" className={getClassNames('card pp-profile')}>
                <div
                    id="ProfileHeader"
                    className={getClassNames(`pp-header${profile.user_header_image ? '' : ' pp-header-empty'}`)}
                    style={profile.user_header_image
                        ? { backgroundImage: `url("${profile.user_header_image}")` }
                        : undefined}
                    role="img"
                    aria-label={profile.user_header_image ? `${profile.user_id} header` : undefined}
                />
                <div className={getClassNames('pp-identity')}>
                    <Avatar src={profile.user_profile_pic} name={profile.user_id} className="pp-avatar" />

                    <div className={getClassNames('pp-names')}>
                        <h2 id="UserName" className={getClassNames('pp-displayname')}>
                            {profile.username || profile.user_id}
                        </h2>
                        <span className={getClassNames('pp-handle')}>@{profile.user_id}</span>
                        {profile.user_alt_name && (
                            <span className={getClassNames('pp-altname')}>{profile.user_alt_name}</span>
                        )}
                        <code className={getClassNames('pp-index')}>{profile.user_index_1st}</code>
                    </div>

                    <div className={getClassNames('pp-badges')}>
                        <StatusBadge status={profile.user_status} />
                        <LevelBadge level={profile.user_level} />
                    </div>
                </div>

                <div className={getClassNames('pp-stats')}>
                    <Link id="Following" to="following" className={getClassNames('pp-stat')}>
                        {plural(countTxt.following, profile.following_count)}
                    </Link>
                    <Link id="Followers" to="followers" className={getClassNames('pp-stat')}>
                        {plural(countTxt.followers, profile.followers_count)}
                    </Link>
                    <Link to="info" className={getClassNames('pp-stat pp-stat-details')}>
                        {pageTxt.view_details}
                    </Link>
                </div>

                {profile.user_description && (
                    <ProfileDescription text={profile.user_description} pageTxt={pageTxt} />
                )}
            </section>

            <GallerySection userIndex={profile.user_index_1st} />

            {/* Following / followers dialog (child routes) */}
            <Outlet />
        </div>
    );
}

export default PersonalPage;
